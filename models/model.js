'use strict';
// Generic mongo model: will be extended in other models

class Model {
  /**
     * Model Constructor
     * @param {Object} schema - mongo schema
     */
  constructor(schema) {
    this.schema = schema;
  }

  /**
     * 
     * @param {String} _id optional mongo record id
     * @return {*}
     */
  read(username) {
    let queryObject = username!==undefined ? {username:username} : {};
    // .find(queryObject) : {_id: _id}, {}
    return this.schema.find(queryObject);
  }
  /**
     * 
     * @param {object} record matches the schema format
     * @return {*}
     */
  create(record) {
    let newRecord = new this.schema(record);
    return newRecord.save();
  }
  /**
     * 
     * @param {string} _id mongo record id
     * @param {object} record shcema object format
     * @return {*}
     */
  update(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, {new: true});
  }
  /**
     * 
     * @param {string} _id 
     * @return {*}
     */
  delete(_id) {
    // return promise
    console.log(_id);
    return this.schema.findByIdAndDelete(_id);
  }

}


module.exports = Model;