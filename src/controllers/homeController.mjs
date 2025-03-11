
export const homeController = {
  getHomePage: (req, res) => {
    res.render('index', { title: 'Welcome to MwalaJS MVC' });
  }
};
