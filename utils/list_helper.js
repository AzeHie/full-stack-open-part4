const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (previous, currentBlog) => {
    return previous.likes >= currentBlog.likes ? previous : currentBlog;
  };

  const blogWithMostLikes = blogs.reduce(reducer, 0);

  return blogWithMostLikes ? blogWithMostLikes : 0;
};

const mostBlogs = (blogs) => {
  if (blogs.length < 1) {
    return null;
  }

  const blogsByAuthor = _.countBy(blogs, 'author'); // returns objects with key-value pairs

  const result = Object.entries(blogsByAuthor).reduce( // converts blogsByAuthor to an array, then calls reduce on it
    (authorWithMost, [author, blogCount]) => {
      if (blogCount > authorWithMost.blogCount) {
        return { author, blogCount };
      }
      return authorWithMost;
    },
    { author: '', blogCount: 0 }
  );

  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
