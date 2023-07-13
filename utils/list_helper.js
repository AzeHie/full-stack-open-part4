const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  }

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
}

const favoriteBlog = (blogs) => {
  const reducer = (previous, currentBlog) => {
    return previous.likes >= currentBlog.likes ? previous : currentBlog;
  }

  const blogWithMostLikes = blogs.reduce(reducer, 0);

  return blogWithMostLikes ? blogWithMostLikes : 0;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}