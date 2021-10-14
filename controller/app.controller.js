const jwt = require('jsonwebtoken');

class AppController {

  appUser = null;

  constructor(req, res) {
    this.req = req;
    this.res = res;
    
    if (this.req.headers.authorization !== undefined && this.req.headers.authorization != '') {
      try {
        const verified = jwt.verify(this.req.headers.authorization, process.env.JWT_KEY);

        if (verified) {
          let decoded = jwt.decode(this.req.headers.authorization);
          this.appUser = decoded ? decoded.profile : null;
        }
      } catch (error) {
        
      }     
    }
  }

  responseJson(data) {
    const errorCode = data.error_code || 0;
    const template = {
      status: errorCode ? false : true,
      error_code: errorCode,
      message: this.getMessageFromCode(errorCode),
      data: (data.data !== undefined && data.data !== null) ? data.data : null
    }
    return this.res.json(template);
  }

  getMessageFromCode(code, extra) {
    switch (code) {
      case 0:
        return `Thành công`
      case 1:
        return `Xác nhận`
      case 101:
        return `Sai tham số`
      case 102:
        return `Lỗi hệ thống`
      case 201:
        return `Sai tài khoản hoặc mật khẩu`
      case 202:
        return `Bạn chưa đăng nhập`
      case 203:
        return `Sai mã token`
      case 204:
        return `Email đã tồn tại`
      case 205:
        return `Tài khoản tồn tại trong nhóm có quyền truy cập dữ liệu`
      case 206:
        return `Tài khoản không tồn tại`
      case 207:
        return `Mã hết hạn`
      case 209:
        return `Không có quyền truy cập`
      case 210:
        return `Account đã tồn tại`
      case 404:
        return `Không tìm thấy bản ghi`
      case 405:
        return `Chưa cài đặt mục`
      case 406:
        return `Tin đang chờ duyệt`
      case 407:
        return `File tải lên không đúng định dạng`
        
      default:
        return ``;
    }
  }
}

module.exports = AppController;