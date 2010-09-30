var sinBody = !document.body;
if (sinBody) { document.write('<bo'+'dy style="margin:0px;padding:0px;">'); }
if ("undefined" == typeof inIframe) inIframe=0;if ("undefined" != typeof inDapIF) inIframe =  inDapIF  ? -1 : inIframe;
if ("undefined" != typeof inFIF) inIframe = inFIF ? -1 : inIframe;
    var eplDoc = inIframe ? parent.document : document;var eplDiv;
    if (!inIframe) {
	document.write('<div id="eplParentContainer146782"></div>');eplDiv = document.getElementById("eplParentContainer146782");
    } else {
    var cF;
	if (inIframe > 0) {
    	    cF = eplDoc.getElementById(document.body.id);
	    if (!cF && window.frameElement) cF = window.frameElement;
	} else {
	    if (window.frameElement) {
		cF = window.frameElement;
	    } else {
		var pFs = eplDoc.frames;
		var pEs = eplDoc.getElementsByTagName("iframe");
		var pfx = -1;
		for (var i = 0; (i < pFs.length) && (-1 == pfx); i++) {
		    if (pFs[i].document == document) pfx = i;
		}
		if (-1 != pfx) cF = pEs[pfx];
	    }
	}
    if (cF) {
	    if (!eplDoc.eplF) eplDoc.eplF = new Array();
	    eplDoc.eplF[ 146782 ] = cF;
	    if (inIframe<0) {
		    cF.height = '0px'; cF.width = '0px';
		    cF.style.height = '0px'; cF.style.width = '0px'
		    cF.style.display = 'none';		    
	    }
	    eplDiv = eplDoc.createElement('div'); eplDiv.name = "eplParentContainer146782"; eplDiv.id = "eplParentContainer146782";
	    var pCF = cF.parentNode; pCF.insertBefore(eplDiv, cF);
	}
    }
if (eplDiv != null) {
	eplDiv.style.display='block';
	eplDiv.style.overflow='visible';
	eplDiv.style.textAlign='left';
	eplDiv.align='left';
	}
var eplTop = (navigator.appVersion.toLowerCase().indexOf('msie')&&!window.opera) ? eplDiv : eplDoc.body;
if (eplDiv && !eplTop) {
	var e = eplDiv;
	while (e.parent) { e = e.parent; }
	eplTop = e;
}
if ("undefined" != typeof inDapIF) { inDapIF = (0!=inIframe)?true:false; }
if ("undefined" != typeof inFIF) { inFIF = (0!=inIframe)?true:false; }
if ("undefined" != typeof eplDiv) {
	if (eplDiv && eplDiv.style) {
		eplDiv.style.visibility = 'hidden';
		eplDiv.style.display = 'none';
	}
}
ctxt_ad_interface = 'http://cm.mx.monografias.overture.com/js_1_0/';
ctxt_ad_width = 728;
ctxt_ad_height = 90;
ctxt_ad_id_rotate = ['monografias1','monografias2','monografias3','monografias4'];
ctxt_ad_config = '22832663519';
ctxt_ad_source = 'monografias_mx_ctxt';
ctxt_ad_newwin = 1;
ctxt_ad_lc = '0000FF';
ctxt_ad_tc = '000000';
ctxt_ad_uc = '669900';
ctxt_ad_bc = 'B0E0E6';
ctxt_ad_cc = 'FFFFFF';
document.write('<scr' + 'ipt src="http://cm.mx.overture.com/partner/js/ypn.js" language="JavaScript"></scr' + 'ipt>');
function eplResizeFrame() {
    var eplFrame = document.eplF ? document.eplF[ 146782 ] : null;
    if (!eplFrame && document.body.id) eplFrame = eplDoc.getElementById(document.body.id);
    if (inIframe!=0 && eplFrame && !document.eplDiframe) {
        eplFrame.style.width = '728px';
	eplFrame.style.height = '90px';
	eplFrame.style.display = '';
    }
    return false;
}
if (inIframe){ setTimeout("eplResizeFrame()", 250); }
	var tpit = ''; if (tpit) { var itag = new Image(); itag.src = tpit; }
if (sinBody) { document.write('</bo'+'dy>'); }
if (inIframe){ setTimeout("document.close();", 300); }var epl_rndP=(new String(Math.random())).substring(2,11);
var sw = self.innerWidth ? self.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body ? document.body.clientWidth : 800;
var sh = self.innerHeight ? self.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body ? document.body.clientHeight : 600;var w2=window.open('http://ads.us.e-planning.net/eb/3/548/bf7aa415a7755913?o=s&pb=7e2d242f93b7f250&rnd=' + epl_rndP, 'pop181445', 'toolbar=no,status=no,scrollbars=yes,menubar=no,directories=no,location=no,resizable=yes,width=665,height=500,left='+(sw/2-332)+',top='+(sh/2-250));
if (w2) {
} else {
document.write('<obj'+'ect id=s codeBase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" height=1 width=1 classid=clsid:d27cdb6e-ae6d-11cf-96b8-444553540000><PARAM NAME="movie" VALUE="http://ads.us.e-planning.net/fp"> <param name="flashvars" value="url=http://ads.us.e-planning.net/eb/3/548/bf7aa415a7755913%3fo%3dp%26fp%3d1%26pb%3d7e2d242f93b7f250%26rnd%3d"><PARAM NAME="quality" VALUE="high"><em'+'bed src="http://ads.us.e-planning.net/fp" flashvars="url=http://ads.us.e-planning.net/eb/3/548/bf7aa415a7755913%3fo%3dp%26fp%3d1%26pb%3d7e2d242f93b7f250%26rnd%3d" quality="high" bgcolor="#ffffff" width=1 height=1 name="s" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></obj'+'ect>');
}
