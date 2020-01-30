function AdminUserFilter(query) {
  this.option = {};
  this.query = query;
  this.setSkip = () => {
    // sets the skip value
    this.option.skip = this.query.skip || 0;
    return this;
  };
  this.setLimits = () => {
    // sets the limits
    this.option.limit = this.query.limit || 100;
  };
  this.setVerified = () => {
    // sets the isVerifie to be true or false
    /** This helps ignore the isVerifie flag if isVerifie is not specified */
    if (this.query.isVerified == true || this.query.isVerified === false) {
      this.option.isVerified = this.query.isVerified;
    }
  };

  // this.setDeleted = () => {
  //   // sets deleted true or false. Default: false
  //   this.option.deleted = this.query.deleted || false;
  // };

}

class FilterUsers {
  constructor(query) {
    this.query = query;
  }

  getFilterQuery() {
    // Run every method of the object to get the required query option.
    const filter = new AdminUserFilter(this.query);
    for (const i in filter) {
      if (typeof filter[i] === 'function') {
        filter[i]();
      }
    }
    return filter.option;
  }
}

module.exports = FilterUsers;
