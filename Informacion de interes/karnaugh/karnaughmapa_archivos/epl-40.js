if ("undefined" == typeof inIframe) inIframe = false;
var eplDoc = inIframe ? parent.document : document;
var sDoc = document;

/* Evitar objetos epl duplicados */
if (eplDoc.epl == undefined) {
function epl() {
	var onload=0;
	var onLoadO;
	var req, rnd;
	var sV, vV;
	var sI, kC;
	var eId, eClassName;
	var eUnderlineColor;
	var espacios = new Array();
	var elist = new Array();
	var hide = new Array();
	var logi = new Array();
	var kVs = new Object();
	var queuedAds = new Object();
	var cntUrls=new Object();
	var customShowFunctions = new Object();
	var initDone = false;

	this.eplInit = init;
	this.eplReady = ready;
	this.eplPushAd = pushAd;
	this.eplShowAds = showAds;
	this.setCustomAdShow = setCustomAdShow;
	this.eplParseText = parseText;
	this.eplSetHighlightAd = setHighlightAd;
	this.eplContentUpdate = contentUpdate;
	this.eplOnShow = onShow;
	this.adShowFlash = eplAdShowFlash;
	this.pushQAd = pushQAd;
	this.popQAd = popQAd;

	this.highlight_show = highlight_show;
	this.highlight_hide = highlight_hide;
	this.highlight_hideev = highlight_hideev;
	this.highlight_realhide = highlight_realhide;
	this.highlight_keep = highlight_keep;

	function slashToUnderscore(string) {
		return string.replace(/\//g, '_');
	}

	function underscoreToSlash(string) {
		return string.replace(/_/g, '/');
	}
	function pushQAd(type, ad) {
		if (null == queuedAds[type]) {
			queuedAds[type] = new Array();
		}
		queuedAds[type].push(ad);
	}
	function popQAd(type) {
		var a=queuedAds[type];
		if ((null!=a) && (a.length>0)) {
			return a.pop();
		} else {
			return null;
		}
	}

	function getElementsByClassName(className, tag, elm){
		var testClass = new RegExp("(^|\\\\s)" + className + "(\\\\s|$)");
		var tag = tag || "*";
		var elm = elm || eplDoc;
		var elements = (tag == "*" && elm.all)? elm.all : elm.getElementsByTagName(tag);
		var returnElements = [];
		var current;
		var length = elements.length;
		for(var i=0; i<length; i++){
			current = elements[i];
			if(testClass.test(current.className)){
				returnElements.push(current);
			}
		}
		return returnElements;
	}

	function gOL(e) {
		var o=0;
		while (e) {
			o += e.offsetLeft;
			e = e.offsetParent;
		}
		return o;
	}

	function gOT(e) {
		var o=0;
		while (e) {
			o += e.offsetTop;
			e = e.offsetParent;
		}
		return o;
	}

	function highlight_show(obj, eI, kw, id) {
		eI = slashToUnderscore(eI);
		var div = eplDoc.getElementById('epl_hl_ad_' + id);
		if (div != undefined) {
			hide[id] = 0;
			if (div.style.display != "inline") {
				onShow(eI, kw, id, 1);
				show(obj, div);
			}
		}
	}

	function highlight_keep(id) {
		var div = eplDoc.getElementById('epl_hl_ad_' + id);
		if (div != undefined) {
			hide[id] = 0;
			if (div.style.display != "inline") {
				div.style.display = "";
			}
		}
	}

	function highlight_hide(id) {
		var div = eplDoc.getElementById('epl_hl_ad_' + id);
		if (div != undefined) {
			div.style.display = "none";
		}
	}

	function highlight_realhide(id) {
		if (hide[id] == 1) {
			var div = eplDoc.getElementById('epl_hl_ad_' + id);
			if (div != undefined) {
				div.style.display = "none";
			}
		}
	}

	function highlight_hideev(id) {
		var func = new Function("eplDoc.epl.highlight_realhide(\'" + id + "\');");
		hide[id] = 1;
		window.setTimeout(func, 1000);
	}

	function show(obj, div) {
		var EventLeft = gOL(obj);
		var EventTop = gOT(obj);

		div.style.display = "";

		var scrollTop = Math.max(eplDoc.body.scrollTop, eplDoc.documentElement.scrollTop);
		var scrollLeft = Math.max(eplDoc.body.scrollLeft, eplDoc.documentElement.scrollLeft);
		var bodyOfsWidth = Math.min(eplDoc.body.offsetWidth, eplDoc.documentElement.offsetWidth);
		var bodyOfsHeight = Math.min(eplDoc.body.offsetHeight, eplDoc.documentElement.offsetHeight);

		var leftVacantSpace = EventLeft - scrollLeft - div.offsetWidth;
		var rightVacantSpace = bodyOfsWidth - EventLeft + scrollLeft - div.offsetWidth;

		var left;
		var top;
		if (leftVacantSpace > rightVacantSpace) {
			left = (EventLeft - div.offsetWidth + obj.offsetWidth);
		} else {
			left = (EventLeft + 5);
		}

		var topVacantSpace = EventTop - div.offsetHeight - scrollTop;
		var bottomVacantSpace = bodyOfsHeight - EventTop + scrollTop - div.offsetHeight;

		if (bottomVacantSpace > topVacantSpace)
			top = (EventTop + obj.offsetHeight + 5);
		else
			top = (EventTop - 5 - div.offsetHeight);

		var e = obj.parentNode;
		while (e) {
			if (e.style != undefined) {
				if (e.style.overflowX == 'auto') {
					top-= e.scrollLeft;
				}
				if (e.style.overflowY == 'auto') {
					top-= e.scrollTop;
				}
			}
			e = e.parentNode;
		}

		div.style.left = left + 'px';
		div.style.top = top + 'px';
	}

	function logI(u) {
		var i=new Image();i.src=u;
	}

	function setCustomAdShow(eI, f) {
		eI = slashToUnderscore(eI);
		customShowFunctions[eI]=f;
	}

	function onShow(eI, kw, id, log_epl) {
		eI = slashToUnderscore(eI);
		var key=eI+"-"+id;
		if (logi[key] == undefined) {
			if (log_epl) {
				var url = sV + 'eli/' + vV + '/' + sI + '/' + underscoreToSlash(eI) + '?rnd=' + Math.random() + '&pb=' + id;
				if (kw) {
					url += '&kw=' + kw;
				}
				logI(url);
			}
			if (cntUrls[id]) {
				for (var i=0; i<cntUrls[id].length; i++) {
					logI(cntUrls[id][i]);
				}
			}
			logi[key] = 1;
		}
	}
	
	function appendScript(script) {
		var l = sDoc.getElementsByTagName('head');
		if (l != undefined && l.length >= 1) {
			l[0].appendChild(script);
		} else {
			l = sDoc.getElementsByTagName('body');
			if (l != undefined && l.length >= 1) {
				l[0].appendChild(script);
			}
		}
	}

	function request(url, func, arg) {
		var script = sDoc.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		
		if (func != undefined) {
			if (arg != undefined) {
				script.arg = arg;
			}
			if (script.readyState) {
				script.onreadystatechange = func;
			} else
			if (sDoc.attachEvent) {
				sDoc.attachEvent("onreadystatechange", func);
			} else {
				script.onload = func;
			}
		}
		appendScript(script);
	}

	function addKeyword(keywords, word, pautas) {
		var array = keywords;
		var words = word.split(" ");
		var i;

		for (i=0; i<words.length; i++) {
			if (array[words[i]]) {
				array[words[i]]['__count']++;
			} else {
				array[words[i]] = new Array();
				array[words[i]]['__count'] = 1;
			}
			array = array[words[i]];
		}

		if (array['__pautas']) {
			for (i=0; i<pautas.length; i++) {
				array['__pautas'][array['__pautas'].length] = pautas[i];
			}
			array['__pautas'].sort();
			for (i=1; i<array['__pautas'].length; i++) {
				if (array['__pautas'][i] == array['__pautas'][i-1]) {
					array['__pautas'].splice(i, 1);
				}
			}
		} else {
			array['__pautas'] = pautas;
		}
	}

	function parseKeywordsData(eI) {
		var keywords = new Array();
		var nkeywords = new Array();
		var data = espacios[eI]['kdata'];

		keywords['sort'] = undefined;
		nkeywords['sort'] = undefined;

		for (var i=0; i<data.length; i+= 2) {
			if (data[i].length > 0) {
				var word = data[i].toLowerCase();
				var pautas = data[i+1];
				if (word.charAt(0) == '-') {
					word = word.substring(1,word.length);
					addKeyword(nkeywords, word, pautas);
				} else {
					addKeyword(keywords, word, pautas);
				}
			}
		}
		espacios[eI]['kws'] = keywords;
		espacios[eI]['nkws'] = nkeywords;
	}

	function eklOnload() {
		if (this.readyState != undefined) {
			if (this.readyState != 'loaded' && this.readyState != 'complete') {
				return;
			}
		}
		var eI = this.arg;

		var data = eval('kw' + eI);
		if (data != undefined) {
			espacios[eI]['kdata'] = data;
			parseKeywordsData(eI);

			if (onload == 1 || espacios[eI]['timeout'] == 0) {
				parseText(eI);
			} else {
				var func = new Function("eplDoc.epl.eplParseText(\'" + eI + "\');");
				window.setTimeout(func, espacios[eI]['timeout']);
			}
		}
	}

	function getKeywords(eI) {
		var u = sV + 'ekl/' + vV + '/' + sI + '/' + underscoreToSlash(eI);
		var cS = (document.charset || document.characterSet) || "";
		u+='.'+(kC||"")+ '.'+cS;
		request(u, eklOnload, eI);
	}

	function id2hex(d) {
		var hD='0123456789ABCDEF';
		var h = hD.substr(d&15,1);
		while (d>15) {
			d>>=4;
			h=hD.substr(d&15,1)+h;
		}
		while (h.length < 6) h = '0' + h;
		return h;
	}

	function showAds(eI, ads) {
		eI = slashToUnderscore(eI);
		if (ads != undefined && espacios[eI] != undefined) {
			espacios[eI]['ads'] = ads;
			parseLoadAds(eI);
		}
	}
	this.waitTimes = [ 500,300,500,1000,1000,1000 ];
	this.eplWaitForAds = function(args) {
		var eA = args.e;
		for (var x in eA) {
			var e = eA[x]; var s = espacios[e.eI];			
			var f = 'eplDoc.epl.requestAds("' +e.eI+ '","' +e.fR+ '","' +e.fi+ '")';
			if (!s.waitCount) { s.waitCount = 0; }
			var t = this.waitTimes[s.waitCount];
			if (t) { setTimeout(f,t); }
		}	
	}
	this.requestAds = function(eI,fR,fI) {
		var s = espacios[eI];
		var u = sV+'eb/'+vV+'/'+sI+'/'+eI+'?o='+(3==s.t?'h':'x')+(s.ma?('&ma='+s.ma):'')+'&fR='+fR+'&fi='+fI+'&rnd='+getRnd();
		s.waitCount++;
		request(u)	
	}
	
	function getRnd() {
		if (!rnd) rnd= Math.random();
		return rnd;
	}
	function getAds(eI) {
		var url = sV + 'eb/' + vV + '/' + sI + '/' + underscoreToSlash(eI) + '?rnd=' + Math.random();
		var i,j;
		var e = espacios[eI];
		var ids = e['ids'];
		var nids = e['nids'];

		if (e['tipo'] == 2 || e['tipo'] == 3) {
			url+= '&kc=' + kC;
		}
		if (e['max_ads'] && (e['max_ads']!=1)) {
			url+= '&ma=' + e['max_ads'];
		}
		if (e['tipo'] == 3) {
			url+= '&o=h';
		} else {
			url+= '&o=x';
		}
		if (kVs) {
			for (var kct in kVs) {
				url+='&kw_'+kct+'='+kVs[kct];
			}
		}

		var charset = document.charset || document.characterSet;
		if (undefined != charset) {
			url+= '&crs=' + charset;
		}

		// keyword + ids
		for (i=0; (i<ids.length) && (url.length < 2000); i++) {
			var skip=0;
			for (j=0; j<ids[i][1].length; j++) {
				if (nids[ids[i][1][j]] == 1) {
					skip = 1;
				}
			}
			if (skip == 0) {
				url+= '&kps_' + escape(ids[i][0]) + '=';
				for (j=0; j<ids[i][1].length; j++) {
					url+= id2hex(ids[i][1][j]);
				}
			}
		}

		request(url);
	}

	String.prototype.ltrim = function() {
		return this.replace(/^\s+/,"");
	}

	function isDelimiter(c) {
		if (c == "." || c == "," || c == ";" || c == "\"" || c == "'") {
			return true;
		}

		return false;
	}

	function parseKeyword(word) {
		var word = word.toLowerCase();
		var c = word.substring(0,1);
		if (isDelimiter(c)) {
			word = word.substring(1,word.length);
		}

		c = word.substring(word.length-1,word.length);
		if (isDelimiter(c)) {
			word = word.substring(0,word.length-1);
		}
		return word;
	}

	function findKeyword(keywords, words, word, i) {
		if (keywords[word]) {
			var array = keywords[word];
			if (array['__count'] > 0) {
				var arrays = new Array();
				var pkws = new Array();
				var string = '';

				pkws[0] = word;
				arrays[0] = array;
				for (var j=1; j<words.length-i; j++) {
					word = parseKeyword(words[i+j]);
					array = array[word];
					pkws[j] = word;
					arrays[j] = array;
					if (array) {
						if ((array['__count'] == 0) && (array['__pautas'])) {
							for (var k=0; k<j; k++) {
								if (k == 0) { string+= pkws[k]; } else { string+= ' ' + pkws[k]; }
							}
							var pautas = array['__pautas'].slice();
							array['__pautas'] = undefined;
							return new Array(string, pautas);
						}
					} else {
						break;
					}
				}

				for (j--; j>=0; j--) {
					if (arrays[j]['__pautas']) {
						array = arrays[j];
						for (var k=0; k<(j+1); k++) {
							if (k == 0) { string+= pkws[k]; } else { string+= ' ' + pkws[k]; }
						}
						var pautas = array['__pautas'].slice();
						array['__pautas'] = undefined;
						return new Array(string, pautas);
					}
				}
			} else
			if (array['__pautas']) {
				var pautas = array['__pautas'].slice();
				array['__pautas'] = undefined;
				return new Array(word, pautas);
			}
		}

		return undefined;
	}

	function parseNode(node, textContent, eI) {
		var words = textContent.split(/[ \t\r\n]/);
		var nkeywords = espacios[eI]['nkws'];
		var keywords = espacios[eI]['kws'];
		var i;

		if (words[0]) {
			words[0] = words[0].ltrim();
		}

		for (i=0; i<words.length; i++) {
			var word, array;

			word = parseKeyword(words[i]);
			if (word.length > 0) {
				array = findKeyword(nkeywords, words, word, i)
				if (array) {
					for (var j=0; j<array[1].length; j++) {
						espacios[eI]['nids'][array[1][j]] = 1;
					}
				}

				array = findKeyword(keywords, words, word, i);
				if (array) {
					espacios[eI]['ids'][espacios[eI]['kws_count']++] = array;

					if (espacios[eI]['tipo'] == 3) {
						var innerHTML = '';
						var start = undefined;
						var tail = undefined;
						var text = '';

						for (var j=0; j<i; j++) {
							innerHTML+= words[j] + ' ';
						}

						var array = array[0].split(" ");
						if (array.length > 0) {
							for (var j=0; j<array.length-1; j++) {
								text+= words[i++] + ' ';
							}
							text+= words[i++];
						}

						var c = text.substring(0,1);
						if (isDelimiter(c)) {
							start = c;
							text = text.substring(1,text.length);
						}

						c = text.substring(text.length-1,text.length);
						if (isDelimiter(c)) {
							tail = c;
							text = text.substring(0,text.length-1);
						}

						if (start) {
							innerHTML+= start;
						}

						var e = eplDoc.createTextNode(innerHTML);
						var parent = node.parentNode;

						parent.insertBefore(e, node);

						e = eplDoc.createElement('nobr');
						e.id = 'epl_kw_' + eI + '_' + (espacios[eI]['kws_count']-1);

						e.innerHTML = text;
						parent.insertBefore(e, node);

						if (tail) {
							innerHTML = tail + ' ';
						} else {
							innerHTML = ' ';
						}
						e = eplDoc.createTextNode(innerHTML);
						parent.insertBefore(e, node);

						innerHTML = '';
						while (i<words.length) {
							innerHTML+= words[i++] + ' ';
						}
						e = eplDoc.createTextNode(innerHTML);
						parent.replaceChild(e, node);
						return 1;
					}
				}
			}
		}

		return 0;
	}

	function _parseNodes(nodes, eI) {
		for (var i=0; i<nodes.length; i++) {
			var node = nodes.item(i);
			if (node.nodeType == 3) {
				if (node.nodeValue != undefined && node.nodeValue.length > 0) {
					var ret = parseNode(node, node.nodeValue, eI);
					if (ret != 0) return ret;
				}
			}

			if (node.childNodes && node.nodeName != 'A' && node.nodeName != 'SCRIPT') {
				var skip=0;
				if (node.id != undefined) {
					if (node.id.substr(0, 6) == 'epl_kw') {
						skip = 1;
					}
				}
				if (skip == 0) {
					var ret = parseNodes(node.childNodes, eI);
					if (ret == -1) return -1;
				}
			}
		}

		return 0;
	}

	function parseNodes(nodes, eI) {
		while (_parseNodes(nodes, eI) == 1) {}
	}

	function parseText(eI) {
		eI = slashToUnderscore(eI);
		var kws = espacios[eI]['kws'];
		if (kws != undefined && espacios[eI]['status'] == 0) {
			var e, i;
			var count=0;

			espacios[eI]['status'] = 1;

			for (i=0; i<16; i++) {
				e = eplDoc.getElementById("epl_context_" + i);
				if (e) {
					var ret = parseNodes(e.childNodes, eI);
					if (ret == -1) return;
					count++;
				}
			}

			if (eId != undefined && eId.length > 0) {
				e = eplDoc.getElementById(eId);
				if (e) {
					var ret = parseNodes(e.childNodes, eI);
					if (ret == -1) return;
				}
				count++;
			}

			if (eClassName != undefined && eClassName.length > 0) {
				var list = getElementsByClassName(eClassName);
				for (i=0; i<list.length; i++) {
					var ret = parseNodes(list[i].childNodes, eI);
					if (ret == -1) return;
				}
				count++;
			}

			if (count == 0) {
				/* Si no se especifico eId o eClassName y tampoco hay pegados divs epl_context_
				   parsear todo el body */
				var ret = parseNodes(eplDoc.body.childNodes, eI);
				if (ret == -1) return;
			}

			if (espacios[eI]['kws_count'] >= 1) {
				getAds(eI);
			}
		}
	}

	function setHighlightAd(eI, ad) {
		var ids = espacios[eI]['ids'];
		var e = undefined;
		var cU = ad.linkurl;
		for (var i=0; (i<ids.length) && (e == undefined); i++) {
			if (ad.kw == ids[i][0]) {
				e = eplDoc.getElementById('epl_kw_' + eI + '_' + i);
				ids[i][0] = undefined;
			}
		}
		if (ad.id && e) {
			var a = eplDoc.createElement('a');
			var text = eplDoc.createTextNode(e.innerHTML);

			if (ad.lnw == 1) {
				var funcclick = new Function('window.open(\'' + cU + '\', \'_blank\'); return false;');
				a.setAttribute("onclick", 'window.open(\'' + cU + '\', \'_blank\'); return false;');
				a.onclick = funcclick;
			}
			a.setAttribute('href', cU);
			a.style.textDecoration = 'underline';
			if (eUnderlineColor != undefined) {
				a.style.borderBottom = '1px solid #' + eUnderlineColor;
			} else {
				a.style.borderBottom = '1px solid #4f35c1';
			}
			a.appendChild(text);
			e.replaceChild(a, e.firstChild);

			var funcover = new Function("eplDoc.epl.highlight_show(this,\'" + eI + "\',\'" + ad.kw + "\',\'" + ad['id'] + "\');");
			var funcout = new Function("eplDoc.epl.highlight_hideev(\'" + ad.id + "\');");

			e.setAttribute("onmouseover", "eplDoc.epl.highlight_show(this,\'" + eI + "\',\'" + ad.kw + "\',\'" + ad['id'] + "\');");
			e.setAttribute("onmouseout", "eplDoc.epl.highlight_hideev(\'" + ad.id + "\');");
			e.onmouseenter = funcover;
			e.onmouseleave = funcout;
		}
	}

	function contentUpdate(eI) {
		if (espacios[eI] != undefined) {
			parseKeywordsData(eI);
			espacios[eI]['kws_count'] = 0;
			espacios[eI]['status'] = 0;
			
			parseText(eI);
		}
	}

	function parseLoadAds(eI) {
		var ads = espacios[eI]['ads'];
		if (ads != undefined) {
			eplAdShow(eI, ads);
		}
	}

	function onLoad() {
		if (onload == 0) {
			onload=1;
			for (var i=0; i<elist.length; i++) {
				parseText(elist[i]);
			}
		}
	}

	function onLoadHandler() {
		onLoad();
		if (onLoadO != undefined) onLoadO();
	}

	function pushAd(eI, tipo, timeout, maxAds) {
		eI = slashToUnderscore(eI);
		/* evitar espacios que se pegaron de forma duplicada */
		if (espacios[eI] == undefined) {
			/* tipo 1 = normal
			   tipo 2 = link contextual
			   tipo 3 = highlight */
			espacios[eI] = {status:0,tipo:tipo,ids:[],nids:[],timeout:timeout,kws_count:0,max_ads:maxAds};
			if (tipo == 2 || tipo == 3) {
				elist.push(eI);
				getKeywords(eI);
			} else {
				getAds(eI);
			}
		}
	}
	
	function ready() {
		return initDone;
	}

	function init(args) {
		sV = args['sV'];
		vV = args['vV'];
		sI = args['sI'];
		kC = args['kC'];
		kVs = args['kVs'];
		eId = undefined || args['eId'];
		eClassName = undefined || args['eClassName'];
		eUnderlineColor = undefined || args['eUnderlineColor'];
		initDone = true;
	}

	/* Inicializacion de la clase */

	onLoadO = window.onload;
	window.onload = onLoadHandler;

	// FUNCIONES SHOW:
	
	function eplPPAds(eI, aA) { // preprocesador de avisos
		for (var i=0; i<aA.length; i++) {
			var adObj = aA[i];
			
			var c = sV + 'ei/3/' + sI + '/' + underscoreToSlash(eI) + '?rnd=' + Math.random() + '&pb=' + adObj.id + '&fi=' + adObj.fi + (adObj.fR?('&fR='+adObj.fR):'');;
			if (adObj.kw) {c += "&kw=" + adObj.kw;}
			if (adObj.ptv) {c += "&ptv=" + adObj.ptv;}
			if (adObj.tpct) {c += "&3pct=" + adObj.tpct;}
			adObj.linkurl=c;
			adObj.shown=0;
			
			if (adObj.kw==undefined) {adObj.kw='';}
			if (adObj.e==undefined) {adObj.e='';}
			if (adObj.uc) {cntUrls[adObj.id] = adObj.uc;}

			if (adObj.tit) {adObj.tit=adObj.tit.replace(/\$KEYWORD/g, adObj.kw);}
			if (adObj.desc) {adObj.desc=adObj.desc.replace(/\$KEYWORD/g, adObj.kw);}
			if (adObj.desc1) {
				adObj.desc1=adObj.desc1.replace(/\$KEYWORD/g, adObj.kw);
	        		if (adObj.desc2) {
	        			adObj.desc2=adObj.desc2.replace(/\$KEYWORD/g, adObj.kw);
	        			adObj.desc = new String(adObj.desc1+'<br/>'+adObj.desc2);
	        		} else {
	        			adObj.desc = new String(adObj.desc1);
	        		}
        		}
    		
			adObj.cOS=1;
			if((adObj.t==191)||(adObj.t==192)||(adObj.t==193)) {adObj.cOS=0;}
		}
		return aA;
	}
	
	function eplAdShowFlash(eI, adObj) {
		var version = eplFlashVersion(adObj.fv);
		var wh = 'width="' + adObj.w + '" height="' + adObj.h + '"';
		var fbt = '';
		var flashvars = '';
		var iurl = adObj.iurl;
		var linkurl = escape(adObj.linkurl);
		var array = {quality:"autohigh",loop:"true",allowscriptaccess:"always"};
		var cT;

		if (adObj.fv < 6) {
			iurl+= '?clickTag=' + linkurl;
		}
		cT = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + version + '" ' + wh + ' border="0" id="eplb' + adObj.id + '">';
		cT+= '<param name=movie value="' + iurl + '">';
		if (adObj.fv >= 6) { array['flashvars'] = 'clickTag=' + linkurl; }
		if (adObj.fbt == 't') { array['wmode'] = 'transparent'; } else
		if (adObj.fbt == 'c') { array['bgcolor'] = adObj.fbc; }
		for (var p in array) {
			cT+= '<param name=' + p + ' value="' + array[p] + '">';
		}
		cT+= '<embed name="eplb' + adObj.id + '" src="'+ iurl + '" ';
		for (var p in array) {
			cT+= p + '="' + array[p] + '" ';
		}
		cT+= 'pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" ' + wh + ' border="0"></embed></object>';
		return cT;
	}

	function eplCacheImages(array) {
		for (var i=0; i<array.length; i++) {
			var image = new Image();
			image.src = array[i];
		}
	}

	function eplAddStyleHL(adObj) {
		var l = eplDoc.getElementsByTagName('head');
		if (l != undefined && l.length >= 1) {
			var style = eplDoc.createElement('style');
			var string = 'td.epl_hl_pub1{font-size:10px;font-weight:normal;color:#69717d;}\na.epl_hl_url1{font-size:11px;font-weight:normal;color:#4f35c1;}\ntd.epl_hl_desc1{font-size:11px;font-weight:normal;color:#777777;}\na.epl_hl_tit1{font-size:12px;font-weight:bold;color:#4f35c1;}\n#epl_hl_ad_' + adObj.id + ' img{margin:0px;}';
			style.setAttribute('type', 'text/css');
			if (style.styleSheet != undefined) {
				style.styleSheet.cssText = string;
			} else {
				var text = eplDoc.createTextNode('\n<!--\n'+string+'\n-->\n'); 
				style.appendChild(text);
			}
			l[0].appendChild(style);
		}
	}

	function eplAdShowHL(eI,adObj, aDiv) {
		var tY=adObj.t;
		var st=adObj.st||1;
		var cU=adObj.linkurl;
		var cT,simg;

		if (document.getElementById('epl_hl_ad_' + adObj.id)) {
			return '';
		}

		simg = adObj.is+'hl/'+st+'/';
		if (adObj.st==2) {
			if (this.styleInit == undefined) {
				eplAddStyleHL(adObj);
				this.styleInit = true;
			}
			var images = new Array(simg+'bt_help.png', simg+'bt_cerrar.png', simg+'ang_sombra_inf_izq.png', simg+'ang_sup_izq.png', simg+'1px_header.png', simg+'separador_header.png', simg+'logo_adhispanic.png', simg+'ang_sup_der.png', simg+'ang_izq.png', simg+'ang_der.png', simg+'ang_inf_izq.png', simg+'ang_inf.png', simg+'ang_inf_der.png');
			eplCacheImages(images);
			var uH=simg+'bt_help.png';var uX=simg+'bt_cerrar.png';
			cT='<div id="epl_hl_ad_' + adObj.id + '" style="position:absolute; display:none; z-index: 5000; background-image: url('+simg+'ang_sombra_inf_izq.png);" onmouseover="eplDoc.epl.highlight_keep(\'' + adObj.id + '\');" onmouseout="eplDoc.epl.highlight_hideev(\'' + adObj.id + '\');">';
			cT+='<div>';
			cT+='<table border="0" cellpadding="0" cellspacing="0" style="background-color: #ececf0;">';
			cT+='<tr><td style="border: 0px; margin: 0px; width: 7px; height: 29px; background-image: url('+simg+'ang_sup_izq.png)"></td><td style="background-image:url('+simg+'1px_header.png)"><table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td class="epl_hl_pub1">Publicidad</td><td><img src="'+simg+'separador_header.png"></td><td align=right style="border: 0px; margin: 0px; width: 94px; height: 29px; background-image: url('+simg+'logo_adhispanic.png)"></td><td align=right valign=center><a href="javascript:eplDoc.epl.highlight_hide(\'' + adObj.id + '\')"><img border="0" alt="x" src="' + uX + '" /></a></td></tr></table></td><td style="border: 0px; margin: 0px; width: 7px; height: 29px; background-image: url('+simg+'ang_sup_der.png)"></td></tr>';
			cT+='<tr><td colspan=3 style="background-color: #000000"></td></tr>';
			cT+='<tr><td style="background-image:url('+simg+'ang_izq.png)"></td><td><table border="0" cellpadding="0" cellspacing="0" style="background-color: #ececf0;">';
			if (adObj.tit) {
				cT+='<tr><th><a class="epl_hl_tit1" href="' + cU + '"';
				if (adObj.lnw == 1) {
					cT+=' onClick="window.open(\'' + cU + '\', \'_blank\'); return false;"';
				}
				cT+='>' + adObj.tit + '</a></th></tr>';
			}

			if (tY==193) {
				cT+='<tr><td>' + eplAdShowFlash(eI, adObj) + '</td></tr>';
			} else if (tY==192) {
				cT+='<tr><td><a href="' + cU + '"';
				if (adObj.lnw == 1) {
					cT+=' onClick="window.open(\'' + cU + '\', \'_blank\'); return false;"';
				}
				cT+='><img border="0" width="' + adObj.w + '" height="' + adObj.h + '" src="' + adObj.iurl + '"></a></td></tr>';
			} else if (tY==191) {
				if (adObj.desc) {
					cT+='<tr><td class="epl_hl_desc1">' + adObj.desc1 + '</td></tr>';
				}
				if (adObj.desc2 !=undefined) {
					cT+='<tr><td class="epl_hl_desc1">' + adObj.desc2 + '</td></tr>';
				}
			}
			if (adObj.urlv) {
				cT+='<tr><td><a class="epl_hl_url1" href="' + cU + '"';
				if (adObj.lnw==1) {
					cT+=' onClick="window.open(\'' + cU + '\', \'_blank\'); return false;"';
				}
				cT+=' style="text-decoration: underline;">' + adObj.urlv + '</a></td></tr>';
			}
			cT+='</table></td><td style="background-image:url('+simg+'ang_der.png)"></td></tr>';
			cT+='<tr><td style="border: 0px; margin: 0px; width: 7px; height: 7px; background-image: url('+simg+'ang_inf_izq.png)"></td><td style="background-image:url('+simg+'ang_inf.png)"></td><td style="border: 0px; margin: 0px; width: 7px; height: 7px; background-image: url('+simg+'ang_inf_der.png)">';
			cT+='</td></tr></table></div></div>';
//			cT+='<img src="'+simg+'ang_sombra_inf_izq.png"><img src="'+simg+'1px_sombra_inf.png"><img src="'+simg+'ang_sombra_inf_der.png"></div>';
			eplDoc.epl.eplSetHighlightAd(eI, adObj);
		} else {
			var images = new Array(simg+'help.png', simg+'preg.png');
			eplCacheImages(images);

			var uH=simg+'help.png';var uX=simg+'preg.png';
			cT='<div id="epl_hl_ad_' + adObj.id + '" style="position:absolute; display:none; z-index: 5000;" onmouseover="eplDoc.epl.highlight_keep(\'' + adObj.id + '\');" onmouseout="eplDoc.epl.highlight_hideev(\'' + adObj.id + '\');">';
			cT+='<div>';
			cT+='<table border="2px" cellpadding="1" cellspacing="0" style="background-color: white;"><tr><td><table width="100%" border="0" cellpadding="2" cellspacing="0"><tr><td align="left"><strong>Highlight</strong></td><td align="right"><a href="javascript:eplDoc.epl.highlight_hide(\'' + adObj.id + '\')"><img border="0" alt="x" src="' + uX + '" /></a></td></tr></table></td></tr><tr><td><table border="0" cellpadding="2" cellspacing="0">';
			if (adObj.tit) {
				cT+='<tr><th><a class="epl_hl_tit1" href="' + cU + '"';
				if (adObj.lnw == 1) {
					cT+=' onClick="window.open(\'' + cU + '\', \'_blank\'); return false;"';
				}
				cT+='>' + adObj.tit + '</a></th></tr>';
			}

			if (tY==193) {
				cT+='<tr><td>' + eplAdShowFlash(eI, adObj) + '</td></tr>';
			} else if (tY==192) {
				cT+='<tr><td><a href="' + cU + '"';
				if (adObj.lnw==1) {
					cT+=' onClick="window.open(\'' + cU + '\', \'_blank\'); return false;"';
				}
				cT+='><img border="0" width="' + adObj.w + '" height="' + adObj.h + '" src="' + adObj.iurl + '"></a></td></tr>';
			} else if (tY==191) {
				if (adObj.desc) {
					cT+='<tr><td>' + adObj.desc1 + '</td></tr>';
				}
				if (adObj.desc2 !=undefined) {
					cT+='<tr><td>' + adObj.desc2 + '</td></tr>';
				}
			}
			if (adObj.urlv) {
				cT+='<tr><td><a href="' + cU + '"';
				if (adObj.lnw == 1) {
					cT+=' onClick="window.open(\'' + cU + '\', \'_blank\'); return false;"';
				}
				cT+=' style="text-decoration: underline;">' + adObj.urlv + '</a></td></tr>';
			}
			cT+='</table></td></tr></table></div></div>';
			eplDoc.epl.eplSetHighlightAd(eI, adObj);
		}

		return cT;
	}

	function eplFlashVersion(version) {
		if (version == 2) { return '2'; }
		else if (version == 4) { return '4,0,2,0'; }
		return version + ',0,0,0';
	}

	function addScript(eplDoc, div, url) {
		var t = eplDoc.createElement('script');
		t.src = url;
		t.language = "JavaScript1.1";
		t.type = "text/javascript";
		div.appendChild(t);
	}
	
	function eplAdShow(eI, adsArray) {
		eI = underscoreToSlash(eI);
		var aDiv = eplDoc.getElementById('eplAdDiv'+eI);
		eI = slashToUnderscore(eI);
		var aA = adsArray || eval('eplDoc.eplSmartAds'+eI);
		aA = eplPPAds(eI, aA);

		if (aA != null && aDiv != null) {
			var c=new Array();
			var cf = customShowFunctions[eI];
			if (cf) {
				var ret = cf(adsArray);
				if (ret) {
					c.push(ret);
				}
			}
			var scripts = new Array();
			for (var i=0; i<aA.length; i++) {
				var adObj = aA[i];
				var cU = adObj.linkurl;
				var tY = adObj.t;
				if (!adObj.shown) {
					var opt = adObj.opt || 0;
					if ((adObj.opt & 1) && !(adObj.o & 4096)) {
						var iframe = document.createElement('iframe');
						iframe.id = 'iframe' + adObj.id;
						iframe.width = adObj.w + 'px';
						iframe.height = adObj.h + 'px';
						iframe.frameBorder = '0';
						iframe.marginwidth = '0px';
						iframe.marginheight = '0px';
						iframe.scrolling = 'no';
						iframe.src = sV + 'eat/' + vV + '/' + sI + '/' + adObj.id + '/f';
	
						aDiv.appendChild(iframe);
					} else if (tY == 1 || tY == 7 || tY == 8) { // imagen
						var cT = '<a href="'+ cU +'"><img src="' + adObj.iurl + '" border="0" width="' + adObj.w + '" height="' + adObj.h + '" alt="' + adObj.tit + '">';
						if ((adObj.e==34)||(adObj.e==32)) {
							cT += '<br>' + adObj.tit;
						}
						cT+='</a>';
						if ((adObj.e==34)||(adObj.e==33)) {
							cT += '<br>' + adObj.desc;
						}
						c.push(cT);
					} else if ((tY>=151) && (tY<=155)) {
						pushQAd("layers", adObj);
						scripts.push("layers");
					} else if (tY==2) { // flash
						c.push(eplAdShowFlash(eI, adObj));
					} else if (tY==41) {
						c.push('<table style="font-family:arial;color:black;font-size:12px;"><tr><th align=left><a style="color:black;decoration:none;" href="'+ cU +'">'+ adObj.tit +'</a></th></tr><tr><td>'+  adObj.desc +'<br/><a style="color:black;decoration:none;" href="'+ cU +'">'+ adObj.urlv +'</a></td></tr></table>');
					} else if((tY==191)||(tY==192)||(tY==193)) { // highlight
						c.push(eplAdShowHL(eI, adObj, aDiv));
					}
				}
				if (adObj.cOS) {
					eplDoc.epl.eplOnShow(eI, adObj.kw, adObj.id, 0);
				}
			}
			aDiv.innerHTML += c.join('');
			if (scripts.length > 0) {
				var t = new Object();
				for (var i=0; i<scripts.length; i++) {
					if (null == t[scripts[i]]) {
						t[scripts[i]] = 1;
						addScript(eplDoc, aDiv, adObj.is + "layers/v4_layers.js");
					}
				}
			}
		}
	}
}

	function eplContentUpdate(eI) {
		if (eplDoc != undefined) {
			eplDoc.epl.eplContentUpdate(eI);
		}
	}

	eplDoc.epl = new epl();
}
