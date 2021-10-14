const AppController = require("./app.controller");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// const { param } = require("../routes/api");

class ReadingPageController extends AppController {
  constructor(req, res, execFuncName) {
    super(req, res);

    if (
      execFuncName &&
      typeof ReadingPageController.prototype[execFuncName] === "function"
    ) {
      ReadingPageController.prototype[execFuncName].call(this);
    }
  }

  async getListImages() {
    
    let id = this.req.params.id;
    id = id.split('~').join('/')

    console.log('id path: ',id)

    const url = `http://www.nettruyenpro.com/truyen-tranh/${id}`;
    let htmlContent = await got(url);
    let dom = new JSDOM(htmlContent.body);

    let list_el = await dom.window.document.querySelectorAll(
      ".reading-detail .page-chapter"
    );

    let arr_images = []
    if(list_el.length > 0) {
      let leng = list_el.length
      for(let i =0 ;i<leng;i++) {
        let url = 'http:' + list_el[i].querySelector('img').getAttribute('src')
        let link = 'https://cors-bypasser.up.railway.app/?url=' + url + '&origin=http://www.nettruyenpro.com/'

        arr_images.push(link)
      }
    }

    console.log('arr_images.length: ',arr_images.length)

    let nav_el = await dom.window.document.querySelector(
      ".breadcrumb li:nth-child(3) a"
    );

    let nav_obj = {}
    if(nav_el) {
      nav_obj.title = nav_el.textContent.trim()
      let link = nav_el.getAttribute('href')
      let temp_lst = link.split('truyen-tranh/')
      nav_obj.path = temp_lst[1]
    }
    
    console.log('nav_obj: ',nav_obj)

    let link_comic_el = await dom.window.document.querySelector(
      ".reading .top .txt-primary a"
    );

    let link_href = null
    if(link_comic_el) {
      link_href = link_comic_el.getAttribute("href")
    }

    console.log("link_href: ",link_href)
    let arr_chapter = []
    let recent_chapter = {}
    if(link_href) {
      // const url_2 = `http://www.nettruyenpro.com/truyen-tranh/${id}`;
      let htmlContent_2 = await got(link_href);
      let dom_2 = new JSDOM(htmlContent_2.body);

      let lst_chapter_el = await dom_2.window.document.querySelectorAll(
        "#item-detail .list-chapter ul li"
      );
  
      if(lst_chapter_el.length > 0) {
        let leng = lst_chapter_el.length
        for(let i=1;i<leng;i++) {
          let obj = {}
          let name = lst_chapter_el[i].querySelector('div:nth-child(1)').textContent
          obj.label = name.split('\n').join('').trim()
  
          let link = lst_chapter_el[i].querySelector('div:nth-child(1) a').getAttribute('href')
          let temp_lst = link.split('truyen-tranh/')
          obj.value = temp_lst[1]

          if(obj.value == id) {
            obj.selected = true
            recent_chapter.path = obj.value
            recent_chapter.index = i
          }
  
          arr_chapter.push(obj)
        }
      }

      console.log("arr_chapter: ",arr_chapter)
      console.log('recent_chapter: ',recent_chapter)

    }  

    let rs = {
      data: arr_images,
      lst_chapter: arr_chapter,
      nav: nav_obj,
      recent_chapter: recent_chapter
    };
    return this.responseJson({ data: rs });
  }
}

module.exports = ReadingPageController;
