const AppController = require("./app.controller");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const url_config = require("../model/config-url");
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

    const url = `${url_config}truyen-tranh/${id}`;
    console.log('url: ', url)
    let htmlContent = await got(url);
    let dom = new JSDOM(htmlContent.body);

    let obj ={}

    let title_el = await dom.window.document.querySelector(
      "#comic-detail .title-manga"
    );

    if(title_el) {
      obj.title = title_el.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
    }

    let thumbnail_el = await dom.window.document.querySelector(
      "#comic-detail .overview-comic .image-info img"
    );

    if(thumbnail_el) {
      obj.thumbnail = thumbnail_el.getAttribute('src')
    }

    let author_el = await dom.window.document.querySelector(
      "#comic-detail .overview-comic .comic-right .info-detail-comic .author p:last-child"
    );

    if(author_el) {
      obj.author = author_el.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
    }

    let status_el = await dom.window.document.querySelector(
      "#comic-detail .overview-comic .comic-right .info-detail-comic .status p:last-child"
    );

    if(status_el) {
      obj.status = status_el.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
    }

    let cate_el = await dom.window.document.querySelector(
      "#comic-detail .overview-comic .comic-right .info-detail-comic .category p:last-child"
    );

    if(cate_el) {
      obj.category = cate_el.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
    }

    let desc_el = await dom.window.document.querySelector(
      "#comic-detail .summary-content p"
    );

    if(desc_el) {
      obj.desc = desc_el.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
    }

    let lst_chapter_el = await dom.window.document.querySelectorAll(
      "#comic-detail .list-chapter ul li"
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

        obj.updated = lst_chapter_el[i].querySelector('div:nth-child(2)').textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()

        arr_chapter.push(obj)
      }
    }
    obj.arr_chapter = arr_chapter

    let rs = {
      data: obj
    };
    return this.responseJson({ data: rs });
  }
}

module.exports = MangaPageController;
