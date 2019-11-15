//=======================================================
// Messenger
//=======================================================
var Messenger = function Messenger(lang, pre_tag, post_tag) {
  this.lang      = lang || 'jp';

  let s = "";
  const pre_tag_  = pre_tag || ''
  const post_tag_ = post_tag || ''
  this.pre_tag   = '<div name="generate_from_form_checker"><span>' + pre_tag_;
  this.post_tag  =  post_tag_ + '</span></div>';
};
Messenger.prototype.min_length = function(name, min_length) {
  (this.lang == 'jp')
    ? s = name + "は" + min_length + '文字以内で入力してください。'
    : ''
  return this.tag_union(s);
};
Messenger.prototype.max_length = function(name, max_length) {
  (this.lang == 'jp')
    ? s = name + "は" + max_length + '文字以上で入力してください。'
    : ''
  return this.tag_union(s);
};
Messenger.prototype.null_false = function(name) {
  (this.lang == 'jp')
    ? s = name + 'が未入力です。'
    : ''
  return this.tag_union(s);
};
Messenger.prototype.alphanumeric = function(name) {
  (this.lang == 'jp')
    ? s = name + 'は半角英数字で入力してください。'
    : ''
  return this.tag_union(s);
};
Messenger.prototype.kana = function(name) {
  (this.lang == 'jp')
    ? s = name + 'は全角カナで入力してください。'
    : ''
  return this.tag_union(s);
};
Messenger.prototype.email = function(name) {
  (this.lang == 'jp')
    ? s = name + 'の形式が不正です。'
    : ''
  return this.tag_union(s);
};
Messenger.prototype.unique = function(val) {
  (this.lang == 'jp')
    ? s = val + 'は既に登録されています。'
    : ''
  return this.tag_union(s);
};
Messenger.prototype.tag_union = function(s) {
  if (s != '') {
    s = this.pre_tag + s + this.post_tag
  } else {
    s = ''
  }
  return s;
};
//=======================================================
// FormChecker
//=======================================================
var FormChecker = function FormChecker(form, notice) {
  this.form          = form;
  this.notice        = notice || '';
  this.form_elements = [];
  this.messages      = [];
  this.messanger     = new Messenger();
  this.error         = false;
  this.find();
};
FormChecker.prototype.min_length = function(ele) {
  const val        = ele.val();
  const name       = $("label[for='"+ ele.attr("id") + "']").text()
  const min_length = ele.attr("data-min_length");

  if (val.length < min_length) {
    s = this.messanger.min_length(name, min_length);
    this.error = true;
  } else {
    s = ''
  }
  return s;
};
FormChecker.prototype.max_length = function(ele) {
  const val        = ele.val();
  const name       = $("label[for='"+ ele.attr("id") + "']").text()
  const max_length = ele.attr("data-max_length");

  if (val.length > max_length) {
    s = this.messanger.max_length(name, max_length);
    this.error = true;
  } else {
    s = ''
  }
  return s;
};
FormChecker.prototype.null_false = function(ele) {
  const val  = ele.val();
  const name = $("label[for='"+ ele.attr("id") + "']").text()

  if (val.trim().length == 0) {
    s = this.messanger.null_false(name);
    this.error = true;
  } else {
    s = ''
  }
  return s;
};
FormChecker.prototype.alphanumeric = function(ele) {
  const val  = ele.val();
  const name = $("label[for='"+ ele.attr("id") + "']").text()

  if(!(val).match(/^[A-Za-z0-9]*$/)){
    s = this.messanger.alphanumeric(name);
    this.error = true;
  } else {
    s = ''
  }
  return s;
};
FormChecker.prototype.kana = function(ele) {
  const val  = ele.val();
  const name = $("label[for='"+ ele.attr("id") + "']").text()

  if(!(val.match(/^[ァ-ヶー　]+$/))){
    s = this.messanger.kana(name);
    this.error = true;
  } else {
    s = ''
  }
  return s;
};
FormChecker.prototype.email = function(ele) {
  const val  = ele.val();
  const name = $("label[for='"+ ele.attr("id") + "']").text()

  if (!(val.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i))){
    s = this.messanger.email(name);
    this.error = true;
  } else {
    s = ''
  }
  return s;
};
FormChecker.prototype.unique = function(ele) {
  const _this = this;
  const val  = ele.val();
  const id   = Number(ele.attr("data-id"));
  const name = $("label[for='"+ ele.attr("id") + "']").text()
  const url  = ele.attr("data-unique") + '?name=' + val + '&id=' + id;

  if (this.form_check_api(url) == "NG") {
    s = _this.messanger.unique(name);
    this.error = true
  } else {
    s = '';
  }
  return s;
};
// ------------------------------------------------------
// FormChecker:form_check_api
// ------------------------------------------------------
FormChecker.prototype.form_check_api = function(url) {
  var rst = $.ajax({
    url: url,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: false
  }).responseText;
  return rst;
};
// ------------------------------------------------------
// FormChecker:append
// ------------------------------------------------------
FormChecker.prototype.single_append = function(ele, ary) {
  const _this = this;
  ary.forEach(function(message, idx, ary_){
    if (message != '') ele.after(message)
  });
};
FormChecker.prototype.relation_append = function() {
  const _this = this;
  this.messages.forEach(function(message, idx, ary){
    if (message != '') _this.notice.append(message);
  });
};
// ------------------------------------------------------
// FormChecker:clean
// ------------------------------------------------------
FormChecker.prototype.clean = function() {
  this.messages = [];
  this.error = false;
};
FormChecker.prototype.single_clean = function() {
  $("*[name=generate_from_form_checker]").each(function(idx,ele){
    $(ele).remove();
  });
  this.clean()
};
FormChecker.prototype.relation_clean = function() {
  this.notice.empty();
  this.clean()
};
// ------------------------------------------------------
// FormChecker:check
// ------------------------------------------------------
FormChecker.prototype.single_check = function() {
  const _this = this;
  let ary = [];
  this.form_elements.forEach(function(ele, idx, ary_){
    ary = [];
      ($(ele).attr("data-min_length"))
      ? ary.push(_this.min_length($(ele)))
      : '';
    ($(ele).attr("data-max_length"))
      ? ary.push(_this.max_length($(ele)))
      : '';
    ($(ele).attr("data-null_false") == 'true')
      ? ary.push(_this.null_false($(ele)))
      : '';
    ($(ele).attr("data-alphanumeric") == 'true')
      ? ary.push(_this.alphanumeric($(ele)))
      : '';
    ($(ele).attr("data-kana") == 'true')
      ? ary.push(_this.kana($(ele)))
      : '';
    ($(ele).attr("data-email") == 'true')
      ? ary.push(_this.email($(ele)))
      : '';
    _this.single_append($(ele), ary)
  });
};
FormChecker.prototype.single_db_check = function() {
  if (this.error == true) return false;
  const _this = this;
  let ary = [];
  this.form_elements.forEach(function(ele, idx, ary_){
    ary = [];
    ($(ele).attr("data-unique"))
      ? ary.push(_this.unique($(ele)))
      : '';
    _this.single_append($(ele), ary)
  });
};
FormChecker.prototype.relation_check = function() {
  const _this = this;
};
FormChecker.prototype.relation_db_check = function() {
  const _this = this;
};
FormChecker.prototype.find = function() {
  ary = [];
  $('#' + this.form.attr("id") + ' [data-check=true]').each(function(idx,ele){
    ary.push(ele)
  });
  this.form_elements = ary;
};
// ------------------------------------------------------
// FormChecker:start
// ------------------------------------------------------
FormChecker.prototype.start = function() {
  this.single_clean()
  this.relation_clean()
  this.single_check()
  this.relation_check()
  this.single_db_check()
  this.relation_db_check()
};
