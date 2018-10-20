import mockjs from 'mockjs';

module.exports = {
  generate(path, definitions) {
    let level = 6;
    let model = this.getModel(path.responses, definitions, level);
    log(model)
  },
  initDefinitions(definition) {
    let list = [];
    for(let d in definition.properties){
      list.push(Utils.extend({name: d, required: ((definition.required||[]).indexOf(d)!=-1)}, definition.properties[d]));
    }
    return list;
  },
  function({type, format}){
    if(format == 'data' || format == 'date-time') {
      return 'Date';
    }
    return {integer: 'Number', string: "String", object: "{}", boolean: "Boolean", number: 'Number'}[type] || '';
  },
  initData(model) {
    if (model.type == 'array') {
      if (schema.items.$ref) {
        return {
          type: 'array',
          name: schema.name,
          model: this.initData({
            type: 'object',
            $ref: schema.items.$ref
          }, definitions, level-1)
        };
      } else {
        return schema;
      }
    } else if (model.type == 'object') {
      if (schema.items.$ref) {
        return {
          type: 'array',
          name: schema.name,
          model: this.initData({
            type: 'object',
            $ref: schema.items.$ref
          }, definitions, level-1)
        };
      } else {
        return schema;
      }
    } else {
      return 
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
