/**
\file plugin.js
Skeleton template for all boomerang plugins.  Use this code as a starting point for your
own plugins.
*/

// w is the window object
(function(w) {

var d=w.document;

// First make sure BOOMR is actually defined.  It's possible that your plugin is loaded before boomerang, in which case
// you'll need this.
BOOMR = BOOMR || {};
BOOMR.plugins = BOOMR.plugins || {};

// A private object to encapsulate all your implementation details
// This is optional, but the way we recommend you do it.
var impl = {
	initialized: false,	//! Set when init has completed to prevent double initialization
	complete: false	//! Set when this plugin has completed
};

/**------------------获取浏览器版本开始------------------**/
function browserinfo(){
	var Browser_Name=navigator.appName;
	var Browser_Version=parseFloat(navigator.appVersion);
	var Browser_Agent=navigator.userAgent;
	var Actual_Version,Actual_Name;
	var is_IE=(Browser_Name=="Microsoft Internet Explorer");//判读是否为ie浏览器
	var is_NN=(Browser_Name=="Netscape");//判断是否为netscape浏览器
	var is_op=(Browser_Name=="Opera");//判断是否为Opera浏览器
	if(is_NN){
		//upper 5.0 need to be process,lower 5.0 return directly
		if(Browser_Version>=5.0){
			if(Browser_Agent.indexOf("Netscape")!=-1){
				var Split_Sign=Browser_Agent.lastIndexOf("/");
				var Version=Browser_Agent.lastIndexOf(" ");
				var Bname=Browser_Agent.substring(0,Split_Sign);
				var Split_sign2=Bname.lastIndexOf(" ");
				Actual_Version=Browser_Agent.substring(Split_Sign+1,Browser_Agent.length);
				Actual_Name=Bname.substring(Split_sign2+1,Bname.length);
			}
			if(Browser_Agent.indexOf("Firefox")!=-1){
				var Split_Sign=Browser_Agent.lastIndexOf("/");
				var Version=Browser_Agent.lastIndexOf(" ");
				Actual_Version=Browser_Agent.substring(Split_Sign+1,Browser_Agent.length);
				Actual_Name=Browser_Agent.substring(Version+1,Split_Sign);
			}
			if(Browser_Agent.indexOf("Safari")!=-1){
				if(Browser_Agent.indexOf("Chrome")!=-1){
					var Split_Sign=Browser_Agent.lastIndexOf(" ");
					var Version=Browser_Agent.substring(0,Split_Sign);;
					var Split_Sign2=Version.lastIndexOf("/");
					var Bname=Version.lastIndexOf(" ");
					Actual_Version=Version.substring(Split_Sign2+1,Version.length);
					Actual_Name=Version.substring(Bname+1,Split_Sign2);
				}
				else{
					var Split_Sign=Browser_Agent.lastIndexOf("/");
					var Version=Browser_Agent.substring(0,Split_Sign);;
					var Split_Sign2=Version.lastIndexOf("/");
					var Bname=Browser_Agent.lastIndexOf(" ");
					Actual_Version=Browser_Agent.substring(Split_Sign2+1,Bname);
					Actual_Name=Browser_Agent.substring(Bname+1,Split_Sign);
				}
			}
		}
		else{
			Actual_Version=Browser_Version;
			Actual_Name=Browser_Name;
		}
	}
	else if(is_IE){
		var Version_Start=Browser_Agent.indexOf("MSIE");
		var Version_End=Browser_Agent.indexOf(";",Version_Start);
		Actual_Version=Browser_Agent.substring(Version_Start+5,Version_End)
		Actual_Name=Browser_Name;

		if(Browser_Agent.indexOf("Maxthon")!=-1||Browser_Agent.indexOf("MAXTHON")!=-1){
			var mv=Browser_Agent.lastIndexOf(" ");
			var mv1=Browser_Agent.substring(mv,Browser_Agent.length-1);
			mv1="遨游版本:"+mv1;
			Actual_Name+="(Maxthon)";
			Actual_Version+=mv1;
		}
	}
	else if(Browser_Agent.indexOf("Opera")!=-1){
		Actual_Name="Opera";
		var tempstart=Browser_Agent.indexOf("Opera");
		var tempend=Browser_Agent.length;
		Actual_Version=Browser_Version;
	}
	else{
		Actual_Name="Unknown Navigator"
		Actual_Version="Unknown Version"
	}
	/*------------------------------------------------------------------------------
	 --Your Can Create new properties of navigator(Acutal_Name and Actual_Version) --
	 --Userage:                                                                     --
	 --1,Call This Function.                                                        --
	 --2,use the property Like This:navigator.Actual_Name/navigator.Actual_Version;--
	 ------------------------------------------------------------------------------*/
	navigator.Actual_Name=Actual_Name;
	navigator.Actual_Version=Actual_Version;

	/*---------------------------------------------------------------------------
	 --Or Made this a Class.                                                     --
	 --Userage:                                                                  --
	 --1,Create a instance of this object like this:var browser=new browserinfo;--
	 --2,user this instance:browser.Version/browser.Name;                        --
	 ---------------------------------------------------------------------------*/
	this.Name=Actual_Name;
	this.Version=Actual_Version;
}
browserinfo();

BOOMR.plugins.dooioo = {
	init: function(config) {
		BOOMR.debug("init dooioo", "dooioo");
		if(w !== BOOMR.window) {
			w = BOOMR.window;
			d = w.document;
		}

		// Other initialisation code here
		if(impl.initialized) {
			return this;
		}

		impl.complete = false;
		// Subscribe to any BOOMR events here.
		// Unless your code will explicitly be called by the developer
		// or by another plugin, you must to do this.
		BOOMR.subscribe("page_ready", this.decorator, null, this);

		impl.initialized = true;
		return this;
	},

	// Any other public methods would be defined here
	decorator: function() {
		// 修饰数据以符合收集数据要求
		BOOMR.addVar('empNo'          , headerParameters.empNo   );
		BOOMR.addVar('empName'        , headerParameters.empName );
		BOOMR.addVar('requestUrl'     , window.location.pathname );
		BOOMR.addVar('href'           , window.location.href     );
		BOOMR.addVar('appCode'        , window.location.host     );
		if(window.document.title){
			var tmpName;
			var tmpArray=window.document.title.split(/-/);
			if(tmpArray.lenth>1){
				tmpName=tmpArray[tmpArray.lenth-1].trim();
			}else{
				tmpName=tmpArray[0].trim();
			}
			BOOMR.addVar('appName'    , tmpName);
		}
		BOOMR.addVar('browserType'    , navigator.Actual_Name    );
		BOOMR.addVar('browserVersion' , navigator.Actual_Version );
		if(window.document.getElementById("ip")){
			BOOMR.addVar('ip'         , window.document.getElementById("ip").value);
		}
		impl.complete = true;
		BOOMR.sendBeacon();
	},

	is_complete: function() {
		return impl.complete;
	}
};

}(window));

