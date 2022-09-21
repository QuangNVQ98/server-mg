const AppController = require("./app.controller");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const url_config = require("../model/config-url");

// const { param } = require("../routes/api");

class FindPageController extends AppController {
  constructor(req, res, execFuncName) {
    super(req, res);

    if (
      execFuncName &&
      typeof FindPageController.prototype[execFuncName] === "function"
    ) {
      FindPageController.prototype[execFuncName].call(this);
    }
  }

  async getListComics() {
    let params = this.req.query
    let type = params.type
    let keyword = params.keyword

    let url = null
    if (keyword && keyword != 'undefined') {
      url = `${url_config}tim-truyen?keyword=` + keyword
    } else {
      if (type && type != 'none') {
        url = `${url_config}tim-truyen/` + type;
      } else {
        url = `${url_config}tim-truyen`;
      }
    }

    let htmlContent = await got(url);
    let dom = new JSDOM(htmlContent.body);
 
    let lst_comic_el = await dom.window.document.querySelectorAll(
      ".main-left .row .item-manga"
    );

    let arr_comic = [];
    let leng = lst_comic_el.length
    for (let i = 0; i < leng; i++) {
      let obj = {};
      let item_el = lst_comic_el[i];

      let title = await item_el.querySelector(".pop-up .manga-information .title span")
        .textContent;
      obj.title = title;

      let chapter_new = await item_el.querySelector('.chapter-detail a').textContent
      obj.chapter = chapter_new

      let link_el = await item_el.querySelector(
        ".image-item a"
      );
      if (link_el) {
        obj.link = link_el.getAttribute("href");

        let temp_lst1 = obj.link.split('truyen-tranh/')
        obj.id = temp_lst1[1]
      }

      let thumbnail_el = await item_el.querySelector(
        ".pop-up .image-mini img"
      );
      if (thumbnail_el) {
        obj.thumbnail = thumbnail_el.getAttribute("data-original");
      }

      let lst_infors_el = await item_el.querySelectorAll(
        ".pop-up .manga-information .synopsis p"
      );
      let leng_infors = lst_infors_el.length;

      let desc_el = await item_el.querySelector(".pop-up .manga-information .content-manga p")
      if (desc_el) {
        obj.desc = desc_el.textContent
      }

      for (let j = 0; j < leng_infors; j++) {
        let item_infor = lst_infors_el[j];
        if (item_infor.textContent.includes("Thể loại:")) {
          let category = item_infor.textContent;
          category = category.replace("Thể loại:", "");
          category = category.split("\n").join("");
          obj.category = category;
        } else if (item_infor.textContent.includes("Tình trạng:")) {
          let status = item_infor.textContent;
          status = status.replace("Tình trạng:", "");
          status = status.split("\n").join("");
          obj.status = status;
        } else if (item_infor.textContent.includes("Ngày cập nhật:")) {
          let updated = item_infor.textContent;
          updated = updated.replace("Ngày cập nhật:", "");
          updated = updated.split("\n").join("");
          obj.updated = updated;
        } else if (item_infor.textContent.includes("Lượt xem:")) {
          let view_count = item_infor.textContent;
          view_count = view_count.replace("Lượt xem:", "");
          view_count = view_count.split("\n").join("");
          obj.view_count = view_count;
        }
      }

      arr_comic.push(obj);
    }

    let rs = {
      data: arr_comic
    };
    return this.responseJson({ data: rs });
  }

  async getListCategory() {
    const url = `${url_config}tim-truyen`;

    let htmlContent = await got(url);
    let dom = new JSDOM(htmlContent.body);

    let lst_category_el = await dom.window.document.querySelectorAll(
      ".content-search-right .categories-detail ul li a"
    );

    let arr_cate = []
    let leng_nav = lst_category_el.length
    if (leng_nav > 0) {
      for (let i = 1; i < leng_nav; i++) {
        let obj = {}
        obj.label = lst_category_el[i].textContent.trim()
        let link = lst_category_el[i].getAttribute('href')
        let temp_lst = link.split('tim-truyen/')
        obj.path = temp_lst[1]

        arr_cate.push(obj)
      }
    }

    // console.log('arr_cate: ',arr_cate)

    let rs = {
      arr_cate: arr_cate
    };
    return this.responseJson({ data: rs });
  }
}

module.exports = FindPageController;
