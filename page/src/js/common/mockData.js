import {Random, Mock} from 'mockjs';

module.exports = {
  generate(path, definitions) {
    let level = 6;
    let model = this.getModel(path, definitions, level);
    return this.initData(model)
  },
  initDefinitions(definition) {
    let list = [];
    for(let d in definition.properties){
      list.push(Utils.extend({name: d, required: ((definition.required||[]).indexOf(d)!=-1)}, definition.properties[d]));
    }
    return list;
  },
  initData(model) {
    if (model.type == 'array') {
      if(model.items) {
        return [this.initData(model.items)];
      }
      if(model.model == null) {
        return null;
      }
      return [this.initData(model.model)]
    } else if (model.type == 'object') {
      let result = {};
      if(model.model == null) {
        return null;
      }
      for(let m of model.model) {
        result[m.name] = this.initData(m);
      }
      return result
    } else if (model.type == 'string'){
      if (model.format == 'data' || model.format == 'date-time') {
        return Random.datetime();
      }
      return Random.string('upper', 5, 10);
    } else if (model.type == 'integer'){
      return Random.int(1, 100);
    } else if (model.type == 'integer'){
      return Random.int(1, 100);
    } else if (model.type == 'boolean'){
      return Random.boolean();
    } else if (model.type == 'number'){
      return Random.float(60, 100, 3, 5);
    }
  },
  getModel(schema, definitions, level) {
    if (level == 0) {
      return null;
    }
    if (schema.type == 'array') {
      if (schema.items.$ref) {
        return {
          type: 'array',
          name: schema.name,
          model: this.getModel({
            type: 'object',
            $ref: schema.items.$ref
          }, definitions, level-1)
        };
      } else {
        return schema;
      }
    }
    if (schema.type == 'object' && schema.properties) {
      if(level == 1) {
        return {
          type: 'object',
          model: null
        };
      }
      let properties = [];
      for(let p of schema.properties) {
        properties.push(this.getModel(p, definitions, level-1));
      }
      return {
        name: schema.name,
        type: 'object',
        model: properties
      };
    }
    if (schema.$ref) {
      let ref = Utils.getSchema(schema.$ref);
      return Utils.extend(this.getModel({
        type: 'object',
        properties: this.initDefinitions(definitions[ref]),
      }, definitions, level), schema);
    }
    return schema;
  },
};
