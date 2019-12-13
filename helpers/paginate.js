const pageSize = 20;

const paginate = ({ page }) => {
    const offset = page * pageSize;
    const limit = pageSize;
  
    return {
      offset,
      limit,
    };
};

module.exports = paginate;