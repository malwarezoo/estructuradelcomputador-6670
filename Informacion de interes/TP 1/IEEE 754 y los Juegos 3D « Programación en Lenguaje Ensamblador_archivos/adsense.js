function google_ad_request_done(google_ads){var s='';var i;if(google_ads.length==0){return;}
s+='<div style="margin-top: 15px;"><a href="'+google_info.feedback_url+'" style="border-bottom: none; text-decoration: none;">Ads by Google</a><br />';if('flash'==google_ads[0].type){s+='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+
' codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"'+
' WIDTH="'+google_ad.image_width+
'" HEIGHT="'+google_ad.image_height+'">'+
'<PARAM NAME="movie" VALUE="'+google_ad.image_url+'">'+
'<PARAM NAME="quality" VALUE="high">'+
'<PARAM NAME="AllowScriptAccess" VALUE="never">'+
'<EMBED src="'+google_ad.image_url+
'" WIDTH="'+google_ad.image_width+
'" HEIGHT="'+google_ad.image_height+
'" TYPE="application/x-shockwave-flash"'+
' AllowScriptAccess="never" '+
' PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer"></EMBED></OBJECT>';}else if('image'==google_ads[0].type){s+='<a onclick="advert_cookie()" href="'+google_ads[0].url+
'" target="_top" title="go to '+google_ads[0].visible_url+
'"><img border="0" src="'+google_ads[0].image_url+
'"width="'+google_ads[0].image_width+
'"height="'+google_ads[0].image_height+'"></a>';}else if('html'==google_ads[0].type){s+=google_ads[0].snippet;}else{if(google_ads.length==1){s+='<div style="display: block; float: left; padding-right: 10px; font-size: 130%; margin: auto;">'+
'<a href="s-p: Go to '+google_ads[0].visible_url+'" '+
'onclick="advert_cookie(); window.location=\''+google_ads[0].url+'\'; return false;">'+
'<span class="gad-head" style="font-size: 1.2em; font-weight: bold;">'+google_ads[0].line1+'</span></a><br />'+
'<span style="">'+
google_ads[0].line2+' '+
google_ads[0].line3+'<br /></span>'+
'<a href="s-p: Go to '+google_ads[0].visible_url+'" '+
'onclick="advert_cookie(); window.location=\''+google_ads[0].url+'\'; return false;">'+
google_ads[0].visible_url+'</a></div>'+
'<br clear="all" />';}else if(google_ads.length==2){for(i=0;i<google_ads.length;++i){s+='<div style="display: block; float: left; padding-right: 10px;">'+
'<a href="s-p: Go to '+google_ads[i].visible_url+'" onclick="advert_cookie(); window.location=\''+google_ads[i].url+'\'; return false;">'+
'<span class="gad-head" style="font-size: 1.2em;">'+google_ads[i].line1+'</span></a><br />'+
'<span class="gad-text" style="font-weight: normal;">'+
google_ads[i].line2+'<br />'+
google_ads[i].line3+'</span><br />'+
'<a href="s-p: Go to '+google_ads[i].visible_url+'" onclick="advert_cookie(); window.location=\''+google_ads[i].url+'\'; return false;">'+
'<span class="gad-url">'+google_ads[i].visible_url+'</span></a></div>';}
s+='<br clear="all" />';}else if(google_ads.length>2){for(i=0;i<google_ads.length;++i){s+='<div style="display: block; width: 100%; padding-bottom: 5px; font-weight: normal;">'+
'<a href="s-p: Go to '+google_ads[i].visible_url+'" onclick="advert_cookie(); window.location=\''+google_ads[i].url+'\'; return false;">'+
'<span class="gad-head" style="font-size: 1.2em;">'+google_ads[i].line1+'</span></a><br />'+
'<span class="gad-text" style="font-weight: normal;">'+
google_ads[i].line2+' '+google_ads[i].line3+'</span><br />'+
'<a href="s-p: Go to '+google_ads[i].visible_url+'" onclick="advert_cookie(); window.location=\''+google_ads[i].url+'\'; return false;">'+
'<span class="gad-url" style="font-weight: normal">'+google_ads[i].visible_url+'</span></a></div>';}}}
s+='<br clear="all" /></div>';document.write(s);return;}
function advert_cookie(){var today=new Date();var expire=new Date();expire.setTime(today.getTime()+315360000000);document.cookie="ads=1;expires="+expire.toGMTString()+";path=/;domain=wordpress.com";}