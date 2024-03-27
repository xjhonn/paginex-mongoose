const { Types } = require('mongoose');

module.exports.paginatePlugin = function paginatePlugin(schema) {
  schema.statics.paginateCollection = async function({ query = {}, options = {} }) {
    const {
      page = 1,
      pageSize = 10,
      additionalAggregations = []
    } = options;

    const skips = pageSize * (page - 1);

    // Función para convertir automáticamente las strings a ObjectId
    const convertValuesRecursively = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(convertValuesRecursively);
      } else if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        Object.keys(obj).forEach((key) => {
          const value = obj[key];
          if (typeof value === 'string' && Types.ObjectId.isValid(value)) {
            newObj[key] = Types.ObjectId(value);
          } else if (typeof value === 'object') {
            newObj[key] = convertValuesRecursively(value);
          } else {
            newObj[key] = value;
          }
        });
        return newObj;
      }
      return obj;
    };

    query = convertValuesRecursively(query);

    let aggregationPipeline = [
      { $match: query },
      ...additionalAggregations,
      {
       $facet: {
         totalDocs: [{ $count: "total" }],
         docs: [{ $skip: skips }, { $limit: pageSize }],
         checkNextPage: [{ $skip: skips + pageSize }, { $limit: 1 }]
       }
     },
     {
       $project: {
         totalDocs: { $arrayElemAt: ["$totalDocs.total", 0] },
         docs: 1,
         hasNextPage: { $gt: [{ $size: "$checkNextPage" }, 0] }
       }
     }
    ];

    const results = await this.aggregate(aggregationPipeline);

    const totalDocs = results[0]?.totalDocs || 0;
    const totalPages = Math.ceil(totalDocs / pageSize);

    return {
      docs: results[0]?.docs || [],
      hasNextPage: results[0]?.hasNextPage || false,
      hasPreviousPage: page <= 1 ? false : true,
      page,
      pageSize,
      totalDocs,
      totalPages,
    };
  };
}