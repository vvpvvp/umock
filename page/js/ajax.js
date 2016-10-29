const ajax = {
  PREFIX: '',
  requestingApi: new Set(),
  extractUrl(url) {
    return url ? url.split('?')[0] : '';
  },
  isRequesting(url) {
    const api = this.extractUrl(url);
    return this.requestingApi.has(api);
  },
  addRequest(url) {
    const api = this.extractUrl(url);
    this.requestingApi.add(api);
  },
  deleteRequest(url) {
    const api = this.extractUrl(url);
    this.requestingApi.delete(api);
  },
  getJson(url, paramJson) {
        // The url can be an options object (which then must have .url)
        // url = this.PREFIX + url;

    return this.ajax({
      url,
      type: 'GET',
      cache: false,
      dataType: 'json',
      data: paramJson,
    });
  },
  get(url, param, { tipError = false, loadding = false, globalLoadding = false } = {}) {
    const params = {
      tipError,
      loadding,
      globalLoadding,
    };
    params.url = url;
    params.type = 'GET';
    if (!$.isEmptyObject(param)) {
      params.data = param;
    }
    return this.ajax(params);
  },
  post(url, param, { isDeffer = false, tipError = false, loadding = false, globalLoadding = false } = {}) {
    const params = {
      isDeffer,
      tipError,
      loadding,
      globalLoadding,
    };
    params.url = url;
    params.type = 'POST';
    if (!$.isEmptyObject(param)) {
      params.data = param;
    }
    return this.ajax(params);
  },
  postJson(url, paramJson, { isDeffer = false, tipError = false, loadding = false, globalLoadding = false } = {}) {
    return this.ajax({
      url,
      type: 'POST',
      data: JSON.stringify(paramJson),
      contentType: 'application/json;charset=UTF-8',
      processData: false,
      dataType: 'json',
      isDeffer,
      tipError,
      loadding,
      globalLoadding,
    });
  },
  patchJson(url, paramJson, dataType) {
    return this.ajax({
      url,
      type: 'PATCH',
      data: JSON.stringify(paramJson),
      contentType: 'application/json;charset=UTF-8',
      processData: false,
      dataType: dataType || 'json',
    });
  },
  deleteAjax(url) {
    return this.ajax({
      url,
      type: 'DELETE',
      dataType: 'json',
    });
  },
  ajax(params) {
    const url = params.url = this.PREFIX + params.url;
    if (params.type != 'GET') {
            // check if the action is avaiable
      if (this.isRequesting(url)) {
        return $.Deferred();
      }
      if (params.isDeffer === false) {
        this.addRequest(url);
      }
    }
    if (params.loadding) {
      params.loaddingDom = $('<div class="sys-loadding"></div>');
      let openedComponent = $('.systab_component.selected');
      if (openedComponent.size() == 0)openedComponent = $('body');
      openedComponent.append(params.loaddingDom);
    }

    if (params.globalLoadding) {
      params.loaddingDom = $('<div class="sys-loadding global"></div>');
      $('body').append(params.loaddingDom);
    }
        // let returnDeffer = ;
        // $.extend(returnDeffer,returnDeffer.then(function(resp){
        //     if (resp._status != 200) {
        //         Toptip(params.type=="GET"?"加载失败":"提交失败", "red");
        //     }
        //     return resp;
        // }));
    return $.ajax(params);
  },
  getContextPath() {
    const pathName = document.location.pathname;
    const index = pathName.substr(1).indexOf('/');
    const result = pathName.substr(0, index + 1);
    return result;
  },
  setSetup() {
    const that = this;
    $.ajaxSetup({
      headers: {
                // "X-UFish-Authorization": "Basic " + D.getData(C.cookieToken),
                // "X-UFish-Source": "Server,Web/" + G.version
        author: 'automind',
      },
      error(XMLHttpRequest, textStatus, errorThrown) {
        const errorMsg = {
          _status: -1,
          _msg: '通讯异常',
        };

        that.deleteRequest(this.url);
        if (this.then) {
          this.then(errorMsg);
        } else if (this.success) {
          this.success(errorMsg);
        } else if (this.done) {
          this.done(errorMsg);
        } else if (textStatus != 'abort') {
          alert('通讯异常', 'red');
        }
      },
      complete(XMLHttpRequest, textStatus) {
        that.deleteRequest(this.url);
        if (this.loaddingDom) {
          this.loaddingDom.remove();
        }
        try {
          const result = $.parseJSON(XMLHttpRequest.responseText);
          if (result && result._status == 403) {
                        // D.removeCookie(C.cookieToken);
                        // D.removeCookie(C.cookieId);
            window.top.location = '/login.html';
          } else if (result && result._status != 200 && this.url != '/api/report/error') {
                        // that.postJson("/report/error",{
                        //     url:this.url,
                        //     type:this.type,
                        //     data:this.data,
                        //     result:result
                        // },{isDeffer:true});
          }
          // if (result && result._status != 200 && this.tipError) {
          //   const errorMsg = this.type == 'POST' ? '提交失败' : '获取失败';
          //   Toptip(this.tipError === true ? errorMsg : this.tipError, 'red');
          // }
        } catch (e) {}
      },
      statusCode: {
        400() {
                    // console.log(400);
        },
        404() {
                    // console.log(404);
        },
        401() {
                    // console.log(401);
        },
      },
    });
  },
};

ajax.setSetup();

export default ajax;
