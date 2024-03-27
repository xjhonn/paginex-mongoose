# paginex-mongoose

Un plugin de paginación flexible y fácil de usar para Mongoose, diseñado para simplificar la paginación de consultas en aplicaciones que utilizan Mongoose con MongoDB.

## Características

- Fácil de integrar con cualquier esquema de Mongoose.
- Soporte para paginación personalizada y agregaciones adicionales.
- Conversión automática de IDs de string a ObjectId para consultas.
- Proporciona información detallada de la paginación como el total de documentos, páginas, y más.

## Requisitos

Este paquete requiere Mongoose versión 5.x.x o superior. Asegúrate de tener Mongoose instalado en tu proyecto:

```bash
npm install mongoose
```

## Instalación

Para instalar el paquete, ejecuta el siguiente comando en tu terminal:

```bash
npm install paginex-mongoose
```

## Uso
Primero, importa el plugin y aplícalo a tu esquema de Mongoose.

```bash
const mongoose = require('mongoose');
const paginatePlugin = require('paginex-mongoose');
const { Schema } = mongoose;

const mySchema = new Schema({
  // tu definición del esquema aquí
});

// Aplicar el plugin de paginación al esquema
mySchema.plugin(paginatePlugin);

const MyModel = mongoose.model('MyModel', mySchema);
```

## Types para NestJS

```bash

import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import GraphQLJSON from "graphql-type-json";
import * as mongoose from 'mongoose';

export interface TuSchemaModel extends mongoose.Model<TuSchema> {
  paginateCollection(opts: PaginateOptions): Promise<PaginateResult<TuSchema>>;
}

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
@ObjectType({ description: 'Tu Schema Description' })
export class TuSchema {
  @Field(type => [GraphQLJSON], { nullable: true })
  docs: JSON;

  @Field(type => Boolean)
  hasNextPage: boolean;

  @Field(type => Boolean)
  hasPreviousPage: boolean;

  @Field(type => Int)
  page: number;

  @Field(type => Int)
  pageSize: number;

  @Field(type => Int)
  totalDocs: Number;

  @Field(type => Int)
  totalPages: number;

}

export const TuSchemaFactory = SchemaFactory.createForClass(TuSchema);
```

No olvidar el:

```bash

TuSchema.plugin(paginatePlugin)

```

## Paginando Resultados

Para paginar los resultados de una consulta, usa el método paginateCollection proporcionado por el plugin en tu modelo:

```bash
async function getPaginatedResults() {
  const options = {
    page: 1, // Página actual
    pageSize: 10, // Cantidad de documentos por página
    additionalAggregations: [/* Agregaciones adicionales si se necesitan */]
  };

  const result = await MyModel.paginateCollection({
    query: {/* tu consulta de búsqueda aquí */},
    options: options
  });

  console.log(result);
  // {
  //   docs: [], // Los documentos de la página actual
  //   totalDocs: 0, // Total de documentos que coinciden con la consulta
  //   totalPages: 0, // Total de páginas
  //   page: 1, // Página actual
  //   pageSize: 10, // Tamaño de página
  //   hasNextPage: false, // Indica si hay una próxima página
  //   hasPreviousPage: false, // Indica si hay una página anterior
  // }
}
```


## Opciones de Paginación
El método paginateCollection acepta un objeto de opciones que te permite personalizar la consulta de paginación. Las opciones disponibles incluyen:

- page: La página actual que deseas recuperar.
- pageSize: El número de documentos por página.
- additionalAggregations: Un array de agregaciones adicionales de Mongoose que deseas aplicar a la consulta.

## Contribuciones
¡Las contribuciones son siempre bienvenidas! Si tienes una sugerencia para mejorar este plugin, no dudes en crear un issue o un pull request.

## Licencia
Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE.md para más detalles.