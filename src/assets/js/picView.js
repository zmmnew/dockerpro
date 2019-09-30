
$(function () {
  $("body").delegate(".seepic", "click", function () {
    //容器
    var $container = $("<div></div>");
    $container.attr("id", "pic_view_container");
    //遮罩层
    var $mask = $("<div></div>");
    $mask.attr("id", "pic_view_mask");
    $mask.attr("title", "点击空白处关闭");
    $mask.css("position", "absolute");
    $mask.css("top", 0);
    $mask.css("bottom", 0);
    $mask.css("left", 0);
    $mask.css("right", 0);
    $mask.css("width", "100%");
    $mask.css("height", "100%");
    $mask.css("background", "#000");
    $mask.css("opacity", 0.7);
    $mask.css("cursor", "pointer");
    $mask.css("z-index", 1000);
    //图片
    var $img = $("<img/>");
    var url = $(this).attr("src");
    $img.attr("id", "pic_view_img");
    $img.attr("src", url);
    $img.attr("title", "滚动放大/缩小");
    $img.css("position", "absolute");
    $img.css("top", "50%");
    $img.css("left", "50%");
    $img.css("z-index", 1001);
    $img.css("cursor", "pointer");
    //组装
    $container.append($mask);
    $container.append($img);
    $("body").append($container);   //显示
    //重置图片大小
    resetPicSize(0.1);
    //绑定滚动鼠标改变图片大小
    onMouseWheel();
    //绑定关闭视图方法
    hidePic();
  });
});

/**
 * 鼠标滚动放大/缩小图片
 */
function onMouseWheel() {
  $("#pic_view_img").bind("mousewheel", function (event) {
    var delta = event.originalEvent.wheelDelta;
    $mask = $("#pic_view_mask"), $img = $(this);
    var dir = delta > 0 ? "up" : "down";
    var m_width = $mask.width();
    var m_height = $mask.height();
    var i_width = $img.width();
    var i_height = $img.height();

    if (dir == "up") {  //放大
      i_width = i_width * 1.1;
      i_height = i_height * 1.1;
      if (i_width < m_width && i_height < m_height) {
        $img.width(parseInt(i_width));
        $img.height(parseInt(i_height));
        $img.css("margin-top", -parseInt(i_height / 2));
        $img.css("margin-left", -parseInt(i_width / 2));
      }
    } else {    //缩小
      i_width = i_width * 0.9;
      i_height = i_height * 0.9;
      if (i_width >= 100 && i_height >= 100) {
        $img.width(parseInt(i_width));
        $img.height(parseInt(i_height));
        $img.css("margin-top", -parseInt(i_height / 2));
        $img.css("margin-left", -parseInt(i_width / 2));
      }
    }
  });
}
/**
 * 点击图片时，重置图片大小
 * @param offset
 */
function resetPicSize(offset) {
  $mask = $("#pic_view_mask"), $img = $("#pic_view_img");
  var m_width = $mask.width();
  var m_height = $mask.height();
  var i_width = $img.width();
  var i_height = $img.height();
  if (m_width <= 0 || m_height <= 0 || i_width <= 0 || i_height <= 0 || offset <= 0) {
    return;
  }
  var scale = 1;
  while (i_width >= m_width || i_height >= m_height) {
    i_width = i_width * (scale - offset);
    i_height = i_height * (scale - offset);
  }
  $img.width(parseInt(i_width));
  $img.height(parseInt(i_height));
  $img.css("margin-top", -parseInt(i_height / 2));
  $img.css("margin-left", -parseInt(i_width / 2));
}
/**
 * 关闭视图
 */
function hidePic() {
  $("#pic_view_mask").click(function () {
    $("#pic_view_container").remove();
  });
  $("#pic_view_img").click(function () {
    $("#pic_view_container").remove();
  });
}
