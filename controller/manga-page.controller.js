const AppController = require("./app.controller");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// const { param } = require("../routes/api");

class MangaPageController extends AppController {
  constructor(req, res, execFuncName) {
    super(req, res);

    if (
      execFuncName &&
      typeof MangaPageController.prototype[execFuncName] === "function"
    ) {
      MangaPageController.prototype[execFuncName].call(this);
    }
  }

  async getInforsComic() {
    
    let id = this.req.params.id;

    console.log('id',id)

    const url = `http://www.nettruyenpro.com/truyen-tranh/${id}`;
    let htmlContent = await got(url);
    let dom = new JSDOM(htmlContent.body);

    let obj ={}

    let title_el = await dom.window.document.querySelector(
      "#item-detail .title-detail"
    );

    if(title_el) {
      obj.title = title_el.textContent
    }

    let thumbnail_el = await dom.window.document.querySelector(
      "#item-detail .detail-info .col-image img"
    );

    if(thumbnail_el) {
      obj.thumbnail = thumbnail_el.getAttribute('src')
    }

    let author_el = await dom.window.document.querySelector(
      "#item-detail .detail-info .col-info .list-info .author p:last-child"
    );

    if(author_el) {
      obj.author = author_el.textContent
    }

    let status_el = await dom.window.document.querySelector(
      "#item-detail .detail-info .col-info .list-info .status p:last-child"
    );

    if(status_el) {
      obj.status = status_el.textContent
    }

    let cate_el = await dom.window.document.querySelector(
      "#item-detail .detail-info .col-info .list-info .kind p:last-child"
    );

    if(cate_el) {
      obj.category = cate_el.textContent
    }

    let desc_el = await dom.window.document.querySelector(
      "#item-detail .detail-content p"
    );

    if(desc_el) {
      obj.desc = desc_el.textContent
    }

    let lst_chapter_el = await dom.window.document.querySelectorAll(
      "#item-detail .list-chapter ul li"
    );

    let arr_chapter = []
    if(lst_chapter_el.length > 0) {
      let leng = lst_chapter_el.length
      for(let i=1;i<leng;i++) {
        let obj = {}
        let name = lst_chapter_el[i].querySelector('div:nth-child(1)').textContent
        obj.name = name.split('\n').join('')

        let link = lst_chapter_el[i].querySelector('div:nth-child(1) a').getAttribute('href')
        let temp_lst = link.split('truyen-tranh/')
        obj.path = temp_lst[1]

        obj.updated = lst_chapter_el[i].querySelector('div:nth-child(2)').textContent

        arr_chapter.push(obj)
      }
    }
    obj.arr_chapter = arr_chapter
    console.log('obj: ',obj)

    let rs = {
      data: obj
    };
    return this.responseJson({ data: rs });
  }
}

module.exports = MangaPageController;
