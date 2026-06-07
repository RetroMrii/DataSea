const getPaginationOptions = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 50);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

const buildPaginationMeta = ({ page, limit, total }) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
};

module.exports = {
  getPaginationOptions,
  buildPaginationMeta,
};