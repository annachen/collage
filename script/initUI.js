
$(function(){

    var left = $("#leftPane").width();
    var right = $("#rightPane").width();
    var all = $("#mainPane").width();
    $("#middlePane").width(all - left - right);

    $("#mainCanvas").attr("width", all-left-right);
    $("#previewDiv").width(right);
    $("#previewCanvas").attr("width", right);

		$("#mainCanvas").css("border", "solid 1px black");
		$("#previewCanvas").css("border", "solid 1px black");
});
