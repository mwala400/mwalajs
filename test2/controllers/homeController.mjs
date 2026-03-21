//homeController.mjs
export const homeController = {
  getHomePage: (req, res) => {
    res.render('index', { title: 'Welcome to MwalaJS MVC' });
  }

};


export const Steps = {
getSteps: (req, res) => {
  res.render('steps', { title: 'Welcome to MwalaJS MVC' });
}
};

export const welcome = {
  getwelcome: (req, res) => {
    res.render('welcome', { title: 'Welcome to MwalaJS MVC' });
  }
  };

  
  export const about = {
    getabout: (req, res) => {
      res.render('about', { title: 'Welcome to MwalaJS MVC' });
    }
    };
    
