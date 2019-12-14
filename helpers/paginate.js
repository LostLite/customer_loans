const pageSize = 50;

const paginate = ({ page }) => {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
  
    return {
      offset,
      limit,
    };
};

module.exports = paginate;