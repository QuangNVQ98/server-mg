const AppController = require("./app.controller");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// const { param } = require("../routes/api");

class HomePageController extends AppController {
  constructor(req, res, execFuncName) {
    super(req, res);

    if (
      execFuncName &&
      typeof HomePageController.prototype[execFuncName] === "function"
    ) {
      HomePageController.prototype[execFuncName].call(this);
    }
  }

  async getListNewestComic() {

    const url = "http://www.nettruyenpro.com/";

    let htmlContent = await got(url);
    let dom = new JSDOM(htmlContent.body);
  
    let lst_comic_el = await dom.window.document.querySelectorAll(
      "#ctl00_divCenter .item"
    );

    let arr_comic = [];
   
    for (let i = 0; i < 10; i++) {
      let obj = {};
      let item_el = lst_comic_el[i];

      let title = await item_el.querySelector(".box_tootip .box_li .title")
        .textContent;
      obj.title = title;

      let chapter_new = await item_el.querySelector('.chapter a').textContent
      obj.chapter = chapter_new

      let link_el = await item_el.querySelector(
        ".box_tootip .box_li .box_img a"
      );
      if (link_el) {
        obj.link = link_el.getAttribute("href");

        let temp_lst1 = obj.link.split('truyen-tranh/')
        obj.id = temp_lst1[1]
      }

      let thumbnail_el = await item_el.querySelector(
        ".box_tootip .box_li .box_img a img"
      );
      if (thumbnail_el) {
        obj.thumbnail = thumbnail_el.getAttribute("data-original");
      }

      let lst_infors_el = await item_el.querySelectorAll(
        ".box_tootip .box_li .message_main p"
      );
      let leng_infors = lst_infors_el.length;

      let desc_el = await item_el.querySelector(".box_tootip .box_li .box_text")
      if(desc_el) {
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
        } else if(item_infor.textContent.includes("Lượt xem:")) {
          let view_count = item_infor.textContent;
          view_count = view_count.replace("Lượt xem:", "");
          view_count = view_count.split("\n").join("");
          obj.view_count = view_count;
        }
      }

      arr_comic.push(obj);
    }

    let rs = {
      data: arr_comic,
    };
    return this.responseJson({ data: rs });
  }
}

module.exports = HomePageController;
