

// ================================================================
// CAN X GLOBAL - QUIZ ENGINE v8
// All IRCC CRS questions including full spouse factors
// Language: Real IELTS/CELPIP/TEF scores -> CLB -> CRS pts
// ================================================================
var SECS = ["Profile","Spouse","Goal","Education","Language","Work","Additional"];

// IRCC IELTS -> CLB official conversion
var IELTS_CLB = {
  speaking:  [["4.0","clb4"],["5.0","clb5"],["5.5","clb6"],["6.0","clb7"],["6.5","clb8"],["7.0","clb9"],["7.5","clb10"],["8.0","clb10"],["8.5","clb10"],["9.0","clb10"]],
  listening: [["4.5","clb4"],["5.0","clb5"],["5.5","clb6"],["6.0","clb7"],["7.5","clb8"],["8.0","clb9"],["8.5","clb10"],["9.0","clb10"]],
  reading:   [["3.5","clb4"],["4.0","clb5"],["5.0","clb6"],["6.0","clb7"],["6.5","clb8"],["7.0","clb9"],["8.0","clb10"],["8.5","clb10"],["9.0","clb10"]],
  writing:   [["4.0","clb4"],["5.0","clb5"],["5.5","clb6"],["6.0","clb7"],["6.5","clb8"],["7.0","clb9"],["7.5","clb10"],["8.0","clb10"],["8.5","clb10"],["9.0","clb10"]]
};
var CELPIP_CLB = {"4":"clb4","5":"clb5","6":"clb6","7":"clb7","8":"clb8","9":"clb9","10":"clb10","11":"clb10","12":"clb10"};
var TEF_CLB = {
  speaking:  [["181","clb4"],["226","clb5"],["271","clb6"],["310","clb7"],["349","clb8"],["371","clb9"],["393","clb10"]],
  listening: [["145","clb4"],["181","clb5"],["217","clb6"],["249","clb7"],["280","clb8"],["298","clb9"],["316","clb10"]],
  reading:   [["121","clb4"],["151","clb5"],["181","clb6"],["207","clb7"],["233","clb8"],["248","clb9"],["263","clb10"]],
  writing:   [["181","clb4"],["226","clb5"],["271","clb6"],["310","clb7"],["349","clb8"],["371","clb9"],["393","clb10"]]
};
var IELTS_SCORES = {
  speaking:  ["","4.0","4.5","5.0","5.5","6.0","6.5","7.0","7.5","8.0","8.5","9.0"],
  listening: ["","4.5","5.0","5.5","6.0","6.5","7.0","7.5","8.0","8.5","9.0"],
  reading:   ["","3.5","4.0","4.5","5.0","5.5","6.0","6.5","7.0","7.5","8.0","8.5","9.0"],
  writing:   ["","4.0","4.5","5.0","5.5","6.0","6.5","7.0","7.5","8.0","8.5","9.0"]
};
var CELPIP_SCORES = ["","4","5","6","7","8","9","10","11","12"];
var TEF_SCORES = {
  speaking:  ["","181","226","271","310","349","371","393"],
  listening: ["","145","181","217","249","280","298","316"],
  reading:   ["","121","151","181","207","233","248","263"],
  writing:   ["","181","226","271","310","349","371","393"]
};
var CLB_LBL  = {none:"--",clb4:"CLB 4",clb5:"CLB 5",clb6:"CLB 6",clb7:"CLB 7",clb8:"CLB 8",clb9:"CLB 9",clb10:"CLB 10+"};
var CLB_RANK = {none:0,clb4:4,clb5:5,clb6:6,clb7:7,clb8:8,clb9:9,clb10:10};
var CLB_PTS_NO_SP = {none:0,clb4:6,clb5:6,clb6:9,clb7:17,clb8:23,clb9:31,clb10:34};
var CLB_PTS_SP    = {none:0,clb4:6,clb5:6,clb6:8,clb7:14,clb8:22,clb9:29,clb10:32};
// Spouse language pts per ability
var SP_LANG_PTS = {clb9:5,clb10:5,clb8:3,clb7:3,clb6:1,clb5:1,clb4:0,none:0};

function scoreToCLB(score, tbl) {
  var clb = "none";
  for (var i=0;i<tbl.length;i++) { if (parseFloat(score)>=parseFloat(tbl[i][0])) clb=tbl[i][1]; }
  return clb;
}
function getCLB(testType, ability, score) {
  if (!score||score==="") return "none";
  if (testType==="celpip") return CELPIP_CLB[score]||"none";
  if (testType==="ielts")  return scoreToCLB(score, IELTS_CLB[ability]);
  if (testType==="tef")    return scoreToCLB(score, TEF_CLB[ability]);
  return "none";
}

// Determine if spouse factors apply
function spouseApplies(a) {
  return (a.marital==="married"||a.marital==="commonlaw") && a.spouse_comes_with==="yes" && a.spouse_is_pr!=="yes";
}

var QS = [
  // Q1 Marital status
  {id:"marital", sec:0, cols:2, num:"1",
   q:"What is your marital status?",
   opts:[
     {v:"single",    l:"Never Married / Single"},
     {v:"married",   l:"Married",           s:"Spouse questions will follow"},
     {v:"commonlaw", l:"Common-Law Partner", s:"Spouse questions will follow"},
     {v:"divorced",  l:"Separated / Divorced"},
     {v:"widowed",   l:"Widowed"}
   ]},

  // Q2i Spouse is citizen/PR?
  {id:"spouse_is_pr", sec:1, cols:2, num:"2i",
   spouse:true,
   q:"2) i. Is your spouse or common-law partner a citizen or permanent resident of Canada?",
   h:"If your spouse is already a Canadian citizen or permanent resident, they cannot accompany you as a spouse for Express Entry purposes. However, family sponsorship pathways may be available.",
   showIf:function(a){return a.marital==="married"||a.marital==="commonlaw";},
   opts:[
     {v:"yes", l:"Yes - they are a Canadian citizen or permanent resident"},
     {v:"no",  l:"No - they are not a Canadian citizen or PR"}
   ]},

  // Q2ii Will spouse come with you?
  {id:"spouse_comes_with", sec:1, cols:2, num:"2ii",
   spouse:true,
   q:"2) ii. Will your spouse or common-law partner come with you to Canada?",
   h:"Spouse factors are only added to your CRS score if your spouse or common-law partner will accompany you to Canada. If they stay behind, no spousal factor points are added.",
   showIf:function(a){return (a.marital==="married"||a.marital==="commonlaw") && a.spouse_is_pr!=="yes";},
   opts:[
     {v:"yes", l:"Yes - my spouse will come with me to Canada", s:"Spouse factor points will apply"},
     {v:"no",  l:"No - my spouse will not accompany me",        s:"No spousal factor points"}
   ]},

  // Q3 Age
  {id:"age", sec:0, cols:3, num:"3",
   q:"3) How old are you?",
   h:"If you have been invited to apply, enter your age on the date you were invited. Otherwise enter your current age.",
   opts:(function(){
     var o=[{v:"17",l:"17 or under"}];
     for(var i=18;i<=45;i++) o.push({v:String(i),l:String(i)});
     o.push({v:"46plus",l:"46 or older"});
     return o;
   })()},

  // Goal (for pathways - not an IRCC question but needed)
  {id:"goal", sec:2, cols:2, num:"",
   q:"What is your primary immigration goal for Canada?",
   h:"This helps us recommend the most relevant pathways for your profile.",
   opts:[
     {v:"pr",      l:"Permanent Residence (PR)"},
     {v:"work",    l:"Work in Canada"},
     {v:"study",   l:"Study in Canada"},
     {v:"family",  l:"Join Family in Canada"},
     {v:"visit",   l:"Visit / Temporary Entry"},
     {v:"business",l:"Business / Investment"},
     {v:"notsure", l:"Not sure yet"}
   ]},

  // Q4 Education
  {id:"education", sec:3, cols:2, num:"4",
   q:"4) What is your highest level of education?",
   h:"Enter the highest level for which you have earned a Canadian credential OR completed an ECA (Educational Credential Assessment) from an approved agency within the last 5 years.",
   showIf:function(a){return a.goal!=="visit";},
   opts:[
     {v:"phd",       l:"Doctoral degree (PhD)",                            s:"150 pts (no spouse)"},
     {v:"masters",   l:"Master's degree or professional degree",           s:"135 pts (no spouse)"},
     {v:"two_deg",   l:"Two or more post-secondary (one must be 3+ years)",s:"128 pts (no spouse)"},
     {v:"bachelors", l:"Bachelor's degree (3+ years)",                     s:"120 pts (no spouse)"},
     {v:"two_year",  l:"Two-year post-secondary diploma or certificate",    s:"98 pts (no spouse)"},
     {v:"one_year",  l:"One-year post-secondary diploma or certificate",    s:"90 pts (no spouse)"},
     {v:"highschool",l:"Secondary school / High school diploma",           s:"30 pts (no spouse)"},
     {v:"less",      l:"Less than secondary school",                       s:"0 pts"}
   ]},

  // Q4b Canadian credential?
  {id:"canada_credential", sec:3, cols:2, num:"4b",
   q:"4b) Have you earned a Canadian degree, diploma, or certificate?",
   h:"To answer Yes: English/French as a Second Language was not more than half your study; you studied at a Canadian school (not a foreign campus); you were enrolled full-time for at least 8 months and physically present in Canada for at least 8 months.",
   showIf:function(a){return a.goal!=="visit"&&a.education&&a.education!=="less"&&a.education!=="highschool";},
   opts:[
     {v:"yes", l:"Yes - I earned a Canadian post-secondary credential"},
     {v:"no",  l:"No - my credentials are from outside Canada"}
   ]},

  // Q4c Level of Canadian credential
  {id:"canada_cred_level", sec:3, cols:2, num:"4c",
   q:"4c) What best describes this Canadian credential?",
   h:"This determines your Study in Canada bonus points (up to 30 points).",
   showIf:function(a){return a.canada_credential==="yes";},
   opts:[
     {v:"masters_phd", l:"Master's degree or PhD at a Canadian university",         s:"+30 additional CRS points"},
     {v:"three_plus",  l:"3-year or longer degree / bachelor's at Canadian institution", s:"+30 additional CRS points"},
     {v:"one_two_yr",  l:"One- or two-year diploma or certificate",                 s:"+15 additional CRS points"}
   ]},

  // Q5i Test results recent?
  {id:"lang_results_recent", sec:4, cols:2, num:"5i",
   q:"5) i. Are your language test results less than two years old?",
   h:"You must submit language test results that are less than two years old for all Express Entry programs, even if English or French is your first language.",
   showIf:function(a){return a.goal!=="visit";},
   opts:[
     {v:"yes", l:"Yes - my results are less than two years old"},
     {v:"no",  l:"No - my results are older than two years or I have not tested yet", s:"You will need to retest before applying"}
   ]},

  // Q5ii Language test + scores (special panel type)
  {id:"lang_test", sec:4, type:"language", num:"5ii",
   q:"5) ii. Which language test did you take for your first official language?",
   h:"Enter your test scores for all four abilities. The CLB level will be calculated automatically.",
   showIf:function(a){return a.goal!=="visit";}},

  // Q5iii Second official language (French)
  {id:"lang2_test", sec:4, type:"language2", num:"5iii",
   q:"5) iii. Do you have results for your second official language?",
   h:"If you have French test results (TEF Canada, TCF Canada) enter them here. French + English bilingual bonus adds up to 50 extra CRS points.",
   showIf:function(a){return a.goal!=="visit";}},

  // Q6i Canadian work experience
  {id:"canadian_work", sec:5, cols:3, num:"6i",
   q:"6) i. In the last 10 years, how many years of skilled work experience do you have IN Canada?",
   h:"Must be paid, full-time (or equivalent part-time), in a NOC TEER 0, 1, 2, or 3 occupation, physically performed in Canada (including remote work for a Canadian employer).",
   showIf:function(a){return a.goal!=="visit"&&a.goal!=="study";},
   opts:[
     {v:"0",     l:"None",       s:"0 pts"},
     {v:"1",     l:"1 year",     s:"40 pts (no spouse)"},
     {v:"2",     l:"2 years",    s:"53 pts (no spouse)"},
     {v:"3",     l:"3 years",    s:"64 pts (no spouse)"},
     {v:"4",     l:"4 years",    s:"72 pts (no spouse)"},
     {v:"5plus", l:"5+ years",   s:"80 pts (no spouse)"}
   ]},

  // Q6ii Foreign work experience
  {id:"foreign_work", sec:5, cols:3, num:"6ii",
   q:"6) ii. In the last 10 years, how many years of foreign skilled work experience do you have?",
   h:"Must be paid, full-time, in a single NOC TEER 0, 1, 2, or 3 occupation performed outside Canada.",
   showIf:function(a){return a.goal!=="visit"&&a.goal!=="study";},
   opts:[
     {v:"0",     l:"None"},
     {v:"1-2",   l:"1 or 2 years"},
     {v:"3plus", l:"3 or more years"}
   ]},

  // Q7 Certificate of qualification
  {id:"trade_cert", sec:5, cols:2, num:"7",
   q:"7) Do you hold a certificate of qualification in a skilled trade from a Canadian province, territory, or federal body?",
   h:"A certificate of qualification lets people work in some skilled trades in Canada. This is not the same as a provincial nomination certificate.",
   showIf:function(a){return a.goal!=="visit"&&a.goal!=="study";},
   opts:[
     {v:"no",  l:"No"},
     {v:"yes", l:"Yes - I hold a Canadian Certificate of Qualification", s:"Up to +50 transferability pts"}
   ]},

  // Q8 Job offer (Note: no longer adds CRS points as of March 25, 2025 - kept for pathway purposes)
  {id:"job_offer", sec:5, cols:2, num:"8",
   q:"8) Do you have a valid job offer supported by a Labour Market Impact Assessment (if needed)?",
   h:"Note: As of March 25, 2025, job offer points have been removed from the CRS formula. A job offer does not add CRS points, but it can still support work permit and PNP applications. A valid offer must be full-time, TEER 0-3, LMIA supported or exempt, for at least 1 year.",
   showIf:function(a){return a.goal!=="visit"&&a.goal!=="study";},
   opts:[
     {v:"yes_teer0", l:"Yes - TEER 0 (senior management) role",      s:"Note: No longer adds CRS pts (March 2025)"},
     {v:"yes_other", l:"Yes - TEER 1, 2, or 3 skilled role",         s:"Note: No longer adds CRS pts (March 2025)"},
     {v:"no",        l:"No valid job offer"}
   ]},

  // Q9 Provincial nomination
  {id:"provincial_nom", sec:6, cols:2, num:"9",
   q:"9) Do you have a nomination certificate from a province or territory?",
   h:"A valid provincial or territorial nomination certificate adds 600 CRS points - effectively guaranteeing an Express Entry Invitation to Apply.",
   showIf:function(a){return a.goal!=="visit"&&a.goal!=="study";},
   opts:[
     {v:"yes", l:"Yes - I have a valid provincial nomination certificate", s:"+600 CRS points"},
     {v:"no",  l:"No provincial nomination"}
   ]},

  // Q10 Sibling in Canada
  {id:"sibling", sec:6, cols:2, num:"10",
   q:"10) Do you (or your accompanying spouse/partner) have at least one brother or sister living in Canada who is a citizen or permanent resident?",
   h:"The sibling must be 18 or older, related by blood, marriage, common-law partnership or adoption, and share a parent with you or your partner.",
   opts:[
     {v:"yes", l:"Yes - sibling is a Canadian citizen or PR", s:"+15 additional CRS points"},
     {v:"no",  l:"No qualifying sibling in Canada"}
   ]},

  // Q11 Spouse education
  {id:"spouse_edu", sec:1, cols:2, num:"11",
   spouse:true,
   q:"11) What is the highest level of education for which your spouse or common-law partner has earned a Canadian credential or ECA?",
   h:"Your partner's education contributes up to 10 additional CRS points under spousal factors.",
   showIf:function(a){return spouseApplies(a);},
   opts:[
     {v:"phd",       l:"PhD / Doctoral degree",                          s:"+10 pts"},
     {v:"masters",   l:"Master's or professional degree",                s:"+10 pts"},
     {v:"two_deg",   l:"Two or more post-secondary (one 3+ years)",      s:"+9 pts"},
     {v:"bachelors", l:"Bachelor's degree (3+ years)",                   s:"+8 pts"},
     {v:"two_year",  l:"Two-year diploma or certificate",                s:"+6 pts"},
     {v:"one_year",  l:"One-year diploma or certificate",                s:"+5 pts"},
     {v:"highschool",l:"Secondary school / High school",                 s:"+2 pts"},
     {v:"less",      l:"Less than secondary school",                     s:"0 pts"}
   ]},

  // Q12 Spouse Canadian work
  {id:"spouse_can_work", sec:1, cols:3, num:"12",
   spouse:true,
   q:"12) In the last 10 years, how many years of skilled work experience in Canada does your spouse or common-law partner have?",
   h:"Must be paid, full-time (or equivalent part-time), in one or more NOC TEER 0, 1, 2, or 3 jobs.",
   showIf:function(a){return spouseApplies(a);},
   opts:[
     {v:"0",     l:"None",     s:"0 pts"},
     {v:"1-2",   l:"1-2 years",s:"+5 pts"},
     {v:"3-4",   l:"3-4 years",s:"+5 pts"},
     {v:"5plus", l:"5+ years", s:"+5 pts"}
   ]},

  // Q13 Spouse language test (special panel)
  {id:"spouse_lang_test", sec:1, type:"spouse_lang", num:"13",
   spouse:true,
   q:"13) Did your spouse or common-law partner take a language test?",
   h:"Spouse language results must be less than two years old. Your spouse's language ability adds up to 20 additional CRS points.",
   showIf:function(a){return spouseApplies(a);}}
];

// ================================================================
// IRCC CRS CALCULATOR - OFFICIAL FORMULA
// ================================================================
function calcCRS(a) {
  var sp = spouseApplies(a);

  // Age
  var age = parseInt(a.age)||0;
  var agePts=0;
  if (!sp) {
    var NSP={17:0,18:99,19:105,20:110,21:110,22:110,23:110,24:110,25:110,26:110,27:110,28:110,29:110,30:105,31:99,32:94,33:88,34:83,35:77,36:72,37:66,38:61,39:55,40:50,41:39,42:28,43:17,44:6};
    agePts = age>=46?0:(NSP[age]||0);
  } else {
    var WSP={17:0,18:90,19:95,20:100,21:100,22:100,23:100,24:100,25:100,26:100,27:100,28:100,29:100,30:95,31:90,32:85,33:80,34:75,35:70,36:65,37:60,38:55,39:50,40:45,41:35,42:25,43:15,44:5};
    agePts = age>=46?0:(WSP[age]||0);
  }

  // Education
  var EN={phd:150,masters:135,two_deg:128,bachelors:120,two_year:98,one_year:90,highschool:30,less:0};
  var ES={phd:140,masters:126,two_deg:119,bachelors:112,two_year:91,one_year:84,highschool:28,less:0};
  var eduPts = sp?(ES[a.education]||0):(EN[a.education]||0);

  // Language per ability
  var lt = a.lang_test_type||"";
  var noTest = a.lang_test_no_test==="yes"||!lt;
  var spkCLB=noTest?"none":getCLB(lt,"speaking",a.lang_test_speaking||"");
  var lisCLB=noTest?"none":getCLB(lt,"listening",a.lang_test_listening||"");
  var rdgCLB=noTest?"none":getCLB(lt,"reading",a.lang_test_reading||"");
  var wrtCLB=noTest?"none":getCLB(lt,"writing",a.lang_test_writing||"");
  var tbl = sp?CLB_PTS_SP:CLB_PTS_NO_SP;
  var spkPts=tbl[spkCLB]||0, lisPts=tbl[lisCLB]||0, rdgPts=tbl[rdgCLB]||0, wrtPts=tbl[wrtCLB]||0;
  var engPts=spkPts+lisPts+rdgPts+wrtPts;

  // French core (second official language)
  var frenchCorePts = a.french==="clb7plus"?24:(a.french==="clb56"?4:0);

  // Canadian work
  var CWN={"0":0,"1":40,"2":53,"3":64,"4":72,"5plus":80};
  var CWS={"0":0,"1":35,"2":46,"3":56,"4":63,"5plus":70};
  var canWkPts=sp?(CWS[a.canadian_work]||0):(CWN[a.canadian_work]||0);
  var core=agePts+eduPts+engPts+frenchCorePts+canWkPts;

  // Spouse factors
  var spousePts=0, spouseEduPts=0, spouseWorkPts=0, spouseLangPts=0;
  var spkCLBsp="none",lisCLBsp="none",rdgCLBsp="none",wrtCLBsp="none";
  var spkPtsSp=0,lisPtsSp=0,rdgPtsSp=0,wrtPtsSp=0;
  if (sp) {
    var SEd={phd:10,masters:10,two_deg:9,bachelors:8,two_year:6,one_year:5,highschool:2,less:0};
    spouseEduPts = SEd[a.spouse_edu]||0;
    spousePts += spouseEduPts;
    // Spouse Canadian work
    spouseWorkPts = (a.spouse_can_work&&a.spouse_can_work!=="0")?5:0;
    spousePts += spouseWorkPts;
    // Spouse language - per ability
    var slt = a.spouse_lang_type||"";
    var sNoTest = a.spouse_lang_no_test==="yes"||!slt;
    if (!sNoTest) {
      var sAbs = ["speaking","listening","reading","writing"];
      var sKeys = ["spouse_lang_speaking","spouse_lang_listening","spouse_lang_reading","spouse_lang_writing"];
      var sCLBVars = [spkCLBsp,lisCLBsp,rdgCLBsp,wrtCLBsp];
      spkCLBsp = getCLB(slt,"speaking",a[sKeys[0]]||"");
      lisCLBsp = getCLB(slt,"listening",a[sKeys[1]]||"");
      rdgCLBsp = getCLB(slt,"reading",a[sKeys[2]]||"");
      wrtCLBsp = getCLB(slt,"writing",a[sKeys[3]]||"");
      spkPtsSp = SP_LANG_PTS[spkCLBsp]||0;
      lisPtsSp = SP_LANG_PTS[lisCLBsp]||0;
      rdgPtsSp = SP_LANG_PTS[rdgCLBsp]||0;
      wrtPtsSp = SP_LANG_PTS[wrtCLBsp]||0;
      spouseLangPts = spkPtsSp+lisPtsSp+rdgPtsSp+wrtPtsSp;
      spousePts += spouseLangPts;
    }
  }

  // Transferability - min CLB
  var allCLBs=[spkCLB,lisCLB,rdgCLB,wrtCLB];
  var minRank=99;
  for (var j=0;j<4;j++){var r=CLB_RANK[allCLBs[j]]||0;if(r<minRank)minRank=r;}
  var clb9up=(minRank>=9),clb7up=(minRank>=7);
  var goodEdu=["phd","masters","two_deg","bachelors","two_year"].includes(a.education);
  var postSec=["phd","masters","two_deg","bachelors","two_year","one_year"].includes(a.education);
  var cw1up=["1","2","3","4","5plus"].includes(a.canadian_work);
  var cw2up=["2","3","4","5plus"].includes(a.canadian_work);
  var fgn3=(a.foreign_work==="3plus"),fgn12=(a.foreign_work==="1-2");
  var eduTA=0;
  if(goodEdu&&clb9up)eduTA=50; else if(goodEdu&&clb7up)eduTA=25; else if(postSec&&clb9up)eduTA=25;
  var eduTB=0;
  if(postSec&&cw2up)eduTB=50; else if(postSec&&cw1up)eduTB=25;
  var eduTrans=Math.min(eduTA+eduTB,50);
  var fgnTA=0;
  if(clb9up&&fgn3)fgnTA=50; else if(clb9up&&fgn12)fgnTA=25; else if(clb7up&&fgn3)fgnTA=25; else if(clb7up&&fgn12)fgnTA=13;
  var fgnTB=0;
  if(cw2up&&fgn3)fgnTB=50; else if(cw2up&&fgn12)fgnTB=25; else if(cw1up&&fgn3)fgnTB=25; else if(cw1up&&fgn12)fgnTB=13;
  var fgnTrans=Math.min(fgnTA+fgnTB,50);
  var certPts=0;
  if(a.trade_cert==="yes")certPts=clb9up?50:clb7up?25:0;
  var transfer=Math.min(eduTrans+fgnTrans+certPts,100);

  // Additional
  var additional=0;
  if(a.provincial_nom==="yes") additional+=600;
  var studyPts=0;
  if(a.canada_credential==="yes"){
    if(a.canada_cred_level==="masters_phd"||a.canada_cred_level==="three_plus")studyPts=30;
    else if(a.canada_cred_level==="one_two_yr")studyPts=15;
  }
  additional+=studyPts;
  if(a.sibling==="yes") additional+=15;
  var frenchBonus=0;
  if(a.french==="clb7plus"){frenchBonus=(minRank>=5)?50:25;additional+=frenchBonus;}

  return {agePts:agePts,eduPts:eduPts,spouseEduPts:spouseEduPts,spouseWorkPts:spouseWorkPts,spouseLangPts:spouseLangPts,spkCLBsp:spkCLBsp,lisCLBsp:lisCLBsp,rdgCLBsp:rdgCLBsp,wrtCLBsp:wrtCLBsp,spkPtsSp:spkPtsSp,lisPtsSp:lisPtsSp,rdgPtsSp:rdgPtsSp,wrtPtsSp:wrtPtsSp,
    spkCLB:spkCLB,lisCLB:lisCLB,rdgCLB:rdgCLB,wrtCLB:wrtCLB,
    spkPts:spkPts,lisPts:lisPts,rdgPts:rdgPts,wrtPts:wrtPts,
    engPts:engPts,frenchCorePts:frenchCorePts,canWkPts:canWkPts,
    core:core,spousePts:spousePts,
    eduTrans:eduTrans,fgnTrans:fgnTrans,certPts:certPts,
    transfer:transfer,studyPts:studyPts,frenchBonus:frenchBonus,
    additional:additional,sp:sp,minRank:minRank,
    total:Math.min(core+spousePts+transfer+additional,1200)};
}

// Pathway scoring
function scorePW(a,crs){
  var s={expressEntry:0,pnp:0,workPermit:0,studyPermit:0,familySponsorship:0,visitorVisa:0,quebecSW:0};
  var gm={pr:[25,15,5,0,0,0,5],work:[12,12,22,0,0,0,5],study:[4,3,5,28,0,0,3],family:[2,2,0,0,32,0,0],visit:[0,0,0,0,0,38,0],business:[4,8,4,0,0,0,3],notsure:[10,10,7,5,0,0,5]};
  var keys=Object.keys(s),gv=gm[a.goal]||[0,0,0,0,0,0,0];
  for(var i=0;i<keys.length;i++) s[keys[i]]+=gv[i]||0;
  if(crs.total>=450)s.expressEntry+=30; else if(crs.total>=300)s.expressEntry+=15; else s.expressEntry+=3;
  if(["phd","masters","two_deg","bachelors"].includes(a.education)){s.expressEntry+=10;s.pnp+=8;}
  else if(["two_year","one_year"].includes(a.education)){s.pnp+=8;s.workPermit+=5;}
  if(crs.minRank>=9){s.expressEntry+=12;s.pnp+=8;} else if(crs.minRank>=7){s.expressEntry+=7;s.pnp+=6;s.workPermit+=5;}
  if(a.french==="clb7plus"){s.expressEntry+=12;s.quebecSW+=25;s.pnp+=8;} else if(a.french==="clb56") s.quebecSW+=8;
  if(["2","3","4","5plus"].includes(a.canadian_work)){s.expressEntry+=15;s.pnp+=10;}
  else if(a.canadian_work==="1"){s.expressEntry+=8;s.pnp+=6;s.workPermit+=8;} else s.workPermit+=5;
  if(a.foreign_work==="3plus"){s.expressEntry+=5;s.pnp+=5;s.workPermit+=8;} else if(a.foreign_work==="1-2"){s.expressEntry+=3;s.pnp+=3;s.workPermit+=5;}
  if(a.job_offer&&a.job_offer!=="no"){s.workPermit+=15;s.pnp+=10;}
  if(a.canada_credential==="yes"){s.studyPermit+=10;s.expressEntry+=5;}
  if(a.goal==="family") s.familySponsorship+=15;
  if(a.goal==="visit")  s.visitorVisa+=20;
  if(a.goal==="business"){s.pnp+=10;s.expressEntry+=5;}
  for(var k in s){if(s[k]<0)s[k]=0;} return s;
}

var PW={
  expressEntry:{title:"Express Entry \u2014 FSW / CEC",tags:["Permanent Residence","Points-Based"],desc:"Canada's flagship PR system. CRS score determines when you receive an ITA. Draws occur every 1\u20132 weeks.",time:"~6 months after ITA",why:["Skilled work experience qualifies under NOC TEER 0\u20133","Education and language scores align with Express Entry pool","Profile suits FSW or Canadian Experience Class"],docs:["Valid passport","ECA report (WES/IQAS)","IELTS or CELPIP results","Employment reference letters (10 years)","Proof of settlement funds"]},
  pnp:{title:"Provincial Nominee Program (PNP)",tags:["Permanent Residence","Province-Specific"],desc:"Provincial nomination adds 600 CRS points. Many provinces have base streams with separate eligibility criteria.",time:"12\u201324 months",why:["Occupation in demand in a Canadian province","Profile suits provincial enhanced or base streams","Lower CRS cut-offs available"],docs:["Express Entry profile","Job offer or employer support","Work experience reference letters","Language test results","ECA for education"]},
  workPermit:{title:"Work Permit \u2014 Employer-Sponsored",tags:["Temporary Work","Bridge to PR"],desc:"Work legally in Canada. Experience gained builds future CRS score and may lead to Express Entry CEC eligibility.",time:"3\u20138 months",why:["Employer interest or job offer in Canada","Skilled work with Canadian labour demand","Canadian experience boosts future CRS"],docs:["Job offer letter","LMIA or LMIA-exempt documentation","Educational credentials","Work experience letters","Valid passport"]},
  studyPermit:{title:"Study Permit + PGWP",tags:["Study","Long-Term PR Pathway"],desc:"Study at a Canadian DLI then work up to 3 years on a PGWP. Direct bridge to Express Entry CEC.",time:"Study permit: 4\u20138 weeks",why:["Study goal aligns with this pathway","Canadian credentials strengthen PR prospects","PGWP work experience boosts CRS"],docs:["DLI acceptance letter","Proof of tuition and living funds","IELTS or CELPIP","Valid passport","Ties to home country"]},
  familySponsorship:{title:"Spousal / Family Sponsorship",tags:["Permanent Residence","Relationship-Based"],desc:"Canadian citizen or PR sponsors a spouse, partner or children. Among the fastest PR pathways.",time:"10\u201316 months (inland)",why:["Close family member is a Canadian citizen or PR","Genuine qualifying relationship with a Canadian sponsor","Sponsorship fits your goal"],docs:["Proof of genuine relationship","Sponsor's status documents","Police clearances","Medical exam results","Sponsor's income evidence"]},
  visitorVisa:{title:"Visitor Visa / Super Visa",tags:["Temporary Entry","Tourism & Family"],desc:"TRV for tourism or business. Super Visa for parents/grandparents of Canadian citizens or PRs \u2014 stays up to 5 years.",time:"TRV: 2\u20138 weeks",why:["Temporary entry with no intent to stay permanently","Profile fits TRV or Super Visa criteria","Strong ties to home country"],docs:["Valid passport","Proof of funds","Travel itinerary or invitation letter","Ties to home country","Super Visa: medical insurance CAD $100k min"]},
  quebecSW:{title:"Quebec Skilled Worker (QSWP)",tags:["Quebec","French Language"],desc:"Quebec's Arrima pool uses a separate points grid heavily weighted toward French, education, and Quebec ties.",time:"18\u201330 months",why:["French proficiency is a major asset","Occupation in demand in Quebec","Prior Quebec ties strengthen eligibility"],docs:["TEF Canada or TCF Canada results","Educational credentials (Quebec equivalency)","Employment records","Certificate of Selection (CSQ)"]}
};

function getTopPaths(pw){
  var e=Object.entries(pw).sort(function(a,b){return b[1]-a[1];}).filter(function(x){return x[1]>8;});
  return e.length?e.slice(0,3).map(function(x){return x[0];}):["expressEntry"];
}
function getCategory(t){
  if(t>=450)return{label:"Strong Potential",cls:"rb-strong",title:"Your CRS score is competitive for Express Entry.",sub:"Your estimated score falls within recent ITA ranges. Review your recommended pathways and speak with our team."};
  if(t>=300)return{label:"Moderate Potential",cls:"rb-moderate",title:"Your profile shows moderate immigration potential.",sub:"Targeted improvements \u2014 especially language scores and Canadian experience \u2014 could bring you into a competitive range."};
  if(t>=150)return{label:"Limited Fit \u2014 Review Needed",cls:"rb-limited",title:"Your profile may need strengthening before applying.",sub:"Provincial streams, work permits, and study pathways may offer routes. Speak with our experts."};
  return{label:"Needs Professional Review",cls:"rb-review",title:"A professional review is strongly recommended.",sub:"Our licensed RCICs can identify options not visible through automated tools."};
}
function getBoostTips(a,crs){
  var tips=[];
  if(crs.minRank<7)tips.push("Your language scores are below CLB 7. Reaching CLB 7 in all four abilities is the minimum for most Express Entry streams. Improving to CLB 9 adds up to 56 more CRS points.");
  else if(crs.minRank<9)tips.push("Improving your weakest language ability to CLB 9 adds significant CRS points. Each of the four abilities is scored separately \u2014 even one weak score reduces your transferability points.");
  if(a.french!=="clb7plus")tips.push("Learning French to NCLC 7+ earns up to 74 additional CRS points (24 core + 50 bilingual bonus) and opens access to lower-competition Quebec streams.");
  if(["highschool","less"].includes(a.education)||!a.education)tips.push("A higher education level adds 90\u2013150 CRS points. Get an ECA (WES or IQAS) for any foreign credentials.");
  if(!a.canadian_work||a.canadian_work==="0")tips.push("Even 1 year of Canadian work experience (NOC TEER 0\u20133) adds 40 core CRS points and opens the Canadian Experience Class \u2014 a direct PR pathway.");
  else if(a.canadian_work==="1")tips.push("Building from 1 to 2+ years of Canadian experience adds 13 more core points and significantly strengthens your Skill Transferability score.");
  if(!tips.length)tips.push("Your profile is well-positioned. A professional review will confirm your exact CRS score, identify the strongest stream, and guide your application.");
  return tips.slice(0,4);
}
function getDocs(keys){
  var all=[],seen={};
  keys.forEach(function(k){if(PW[k])PW[k].docs.forEach(function(d){if(!seen[d]){seen[d]=1;all.push(d);}});});
  return all.slice(0,8);
}

// ── STATE ─────────────────────────────────────────────────────
var curQ=0,answers={},started=false;
var SK="canx_v8";
function save(){try{localStorage.setItem(SK,JSON.stringify({curQ:curQ,answers:answers,started:started}));}catch(e){}}
function load(){try{var d=JSON.parse(localStorage.getItem(SK)||"null");if(d){curQ=d.curQ||0;answers=d.answers||{};started=d.started||false;return true;}}catch(e){}return false;}
function visibleQs(){return QS.filter(function(q){return !q.showIf||q.showIf(answers);});}

// ── LANGUAGE PANEL BUILDER ────────────────────────────────────
function buildLangPanel(prefix, forSpouse) {
  var wrap = document.getElementById("q-opts");
  wrap.innerHTML="";
  var testType = answers[prefix+"_type"]||"";
  var noTest   = answers[prefix+"_no_test"]==="yes";
  var panel=document.createElement("div"); panel.className="lang-panel";
  var title = forSpouse?"13) Spouse language test results (less than 2 years old)":"Enter your test scores:";
  panel.innerHTML=
    '<div class="lang-panel-title">'+title+'<\/div>'+
    '<div class="lang-test-row">'+
      '<span class="lang-test-label">'+(forSpouse?"Which test did your spouse take?":"Which test did you take?")+'<\/span>'+
      '<select class="fsel" id="lang-type-sel" style="flex:1">'+
        '<option value="">Select...<\/option>'+
        '<option value="ielts"'+(testType==="ielts"?" selected":"")+'>IELTS General Training<\/option>'+
        '<option value="celpip"'+(testType==="celpip"?" selected":"")+'>CELPIP-G<\/option>'+
        '<option value="tef"'+(testType==="tef"?" selected":"")+'>TEF Canada<\/option>'+
      '<\/select>'+
    '<\/div>'+
    '<div id="lang-scores-wrap">'+
      '<div class="lang-abilities">'+
        '<div class="lang-ab"><div class="lang-ab-lbl">Speaking:<\/div><select class="fsel" id="ls-spk"><option value="">Select...<\/option><\/select><div class="lang-ab-clb" id="lc-spk"><\/div><\/div>'+
        '<div class="lang-ab"><div class="lang-ab-lbl">Listening:<\/div><select class="fsel" id="ls-lis"><option value="">Select...<\/option><\/select><div class="lang-ab-clb" id="lc-lis"><\/div><\/div>'+
        '<div class="lang-ab"><div class="lang-ab-lbl">Reading:<\/div><select class="fsel" id="ls-rdg"><option value="">Select...<\/option><\/select><div class="lang-ab-clb" id="lc-rdg"><\/div><\/div>'+
        '<div class="lang-ab"><div class="lang-ab-lbl">Writing:<\/div><select class="fsel" id="ls-wrt"><option value="">Select...<\/option><\/select><div class="lang-ab-clb" id="lc-wrt"><\/div><\/div>'+
      '<\/div>'+
    '<\/div>'+
    '<label class="lang-no-test-row'+(noTest?" sel":"")+'">'+
      '<input type="checkbox" id="lang-no-chk"'+(noTest?" checked":"")+'>'+
      '<span>'+(forSpouse?"Spouse has not taken a language test":"Have not taken a language test yet")+'<\/span>'+
    '<\/label>';
  wrap.appendChild(panel);

  function getScores(t,ab){
    if(t==="ielts")return IELTS_SCORES[ab];
    if(t==="celpip")return CELPIP_SCORES;
    if(t==="tef")return TEF_SCORES[ab];
    return [""];
  }
  function updateDropdowns(){
    var t=(document.getElementById("lang-type-sel")||{}).value||"";
    var abs=["speaking","listening","reading","writing"];
    var sids=["ls-spk","ls-lis","ls-rdg","ls-wrt"];
    var cids=["lc-spk","lc-lis","lc-rdg","lc-wrt"];
    abs.forEach(function(ab,i){
      var sel=document.getElementById(sids[i]); if(!sel)return;
      var cur=answers[prefix+"_"+ab]||"";
      var scores=getScores(t,ab);
      var html='<option value="">Select...<\/option>';
      for(var j=1;j<scores.length;j++) html+='<option value="'+scores[j]+'"'+(cur===scores[j]?" selected":"")+'>'+scores[j]+'<\/option>';
      sel.innerHTML=html;
      var clb=(t&&cur)?getCLB(t,ab,cur):"none";
      var cel=document.getElementById(cids[i]); if(!cel)return;
      if(clb!=="none"){cel.textContent=CLB_LBL[clb];cel.className="lang-ab-clb ok";sel.className="fsel filled";}
      else{cel.textContent="";cel.className="lang-ab-clb";sel.className="fsel";}
    });
    checkDone();
  }
  function checkDone(){
    var noChk=document.getElementById("lang-no-chk");
    if(noChk&&noChk.checked){document.getElementById("btn-next").disabled=false;return;}
    var t=(document.getElementById("lang-type-sel")||{}).value||"";
    if(!t){document.getElementById("btn-next").disabled=true;return;}
    var allFilled=["ls-spk","ls-lis","ls-rdg","ls-wrt"].every(function(id){
      var s=document.getElementById(id); return s&&s.value!=="";
    });
    document.getElementById("btn-next").disabled=!allFilled;
  }
  function saveAll(){
    var t=(document.getElementById("lang-type-sel")||{}).value||"";
    answers[prefix+"_type"]=t;
    var abs=["speaking","listening","reading","writing"];
    var sids=["ls-spk","ls-lis","ls-rdg","ls-wrt"];
    abs.forEach(function(ab,i){
      answers[prefix+"_"+ab]=(document.getElementById(sids[i])||{}).value||"";
    });
    var noChk=document.getElementById("lang-no-chk");
    answers[prefix+"_no_test"]=(noChk&&noChk.checked)?"yes":"no";
    save();
  }
  // Events
  var noChk=document.getElementById("lang-no-chk");
  noChk.onchange=function(){
    var c=this.checked; answers[prefix+"_no_test"]=c?"yes":"no";
    var scw=document.getElementById("lang-scores-wrap"),tsel=document.getElementById("lang-type-sel");
    var lbl=this.closest?this.closest(".lang-no-test-row"):null;
    if(lbl)lbl.className="lang-no-test-row"+(c?" sel":"");
    scw.style.opacity=c?"0.3":"1"; scw.style.pointerEvents=c?"none":"auto"; tsel.disabled=c;
    if(c){answers[prefix+"_type"]="";["speaking","listening","reading","writing"].forEach(function(ab){answers[prefix+"_"+ab]="";});}
    save(); checkDone();
  };
  document.getElementById("lang-type-sel").onchange=function(){
    answers[prefix+"_type"]=this.value;
    ["speaking","listening","reading","writing"].forEach(function(ab){answers[prefix+"_"+ab]="";});
    save(); updateDropdowns();
  };
  var abs2=["speaking","listening","reading","writing"];
  var sids2=["ls-spk","ls-lis","ls-rdg","ls-wrt"];
  var cids2=["lc-spk","lc-lis","lc-rdg","lc-wrt"];
  sids2.forEach(function(id,i){
    var sel=document.getElementById(id); if(!sel)return;
    sel.onchange=function(){
      answers[prefix+"_"+abs2[i]]=this.value;
      var t=answers[prefix+"_type"]||""; var clb=(t&&this.value)?getCLB(t,abs2[i],this.value):"none";
      var cel=document.getElementById(cids2[i]); if(cel){
        if(clb!=="none"){cel.textContent=CLB_LBL[clb];cel.className="lang-ab-clb ok";this.className="fsel filled";}
        else{cel.textContent="";cel.className="lang-ab-clb";this.className="fsel";}
      }
      saveAll(); checkDone();
    };
  });
  // Apply initial state
  if(noTest){
    var sw=document.getElementById("lang-scores-wrap"),ts=document.getElementById("lang-type-sel");
    if(sw){sw.style.opacity="0.3";sw.style.pointerEvents="none";} if(ts)ts.disabled=true;
  }
  if(testType) updateDropdowns();
  checkDone();
}

function buildLang2Panel() {
  // Second official language (French - radio style + optional panel)
  var wrap=document.getElementById("q-opts"); wrap.innerHTML="";
  var val=answers["french"]||"";

  var grid=document.createElement("div"); grid.className="opts";
  var opts2=[
    {v:"clb7plus",l:"Yes \u2014 NCLC 7 or higher in all four abilities",s:"Up to +74 CRS points (core + bilingual bonus)"},
    {v:"clb56",   l:"Yes \u2014 NCLC 5 or 6 in all four abilities",    s:"Up to +4 core CRS points"},
    {v:"none",    l:"Not applicable / No French results"}
  ];
  opts2.forEach(function(opt){
    var btn=document.createElement("button");
    btn.className="opt"+(val===opt.v?" sel":"");
    btn.innerHTML='<div class="opt-radio"><div class="opt-dot"><\/div><\/div><span class="opt-lbl">'+opt.l+(opt.s?'<span class="opt-sub">'+opt.s+'<\/span>':"")+'<\/span>';
    btn.onclick=function(){
      answers["french"]=opt.v; save();
      grid.querySelectorAll(".opt").forEach(function(c){c.classList.remove("sel");});
      btn.classList.add("sel");
      document.getElementById("btn-next").disabled=false;
      setTimeout(function(){if(answers["french"]===opt.v)nextQ();},260);
    };
    grid.appendChild(btn);
  });
  wrap.appendChild(grid);
  document.getElementById("btn-next").disabled=!val;
}

// ── RENDER ────────────────────────────────────────────────────
function startQuiz(){
  started=true;save();
  show("s-question");
  document.getElementById("prog-wrap").style.display="block";
  document.getElementById("quiz-nav").style.display="flex";
  renderQ(true);
}

function renderQ(fwd){
  if(fwd===undefined)fwd=true;
  var vqs=visibleQs();
  if(curQ>=vqs.length){showResults();return;}
  var q=vqs[curQ];

  // Spouse banner
  var banner=document.getElementById("q-spouse-banner"); banner.innerHTML="";
  if(q.spouse){
    banner.innerHTML='<div class="spouse-banner"><div class="spouse-banner-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="#ffffff" stroke-width="1.5"\/><path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"\/><\/svg><\/div><div class="spouse-banner-text"><strong>Spouse \\/ Partner Questions<\/strong><br>These questions affect the spousal factor portion of your CRS score (up to +40 points).<\/div><\/div>';
  }

  document.getElementById("q-pill").textContent="Section "+(q.sec+1)+" \u00b7 "+SECS[q.sec];
  document.getElementById("q-title").textContent=q.q;
  var iWrap=document.getElementById("q-info-wrap");
  iWrap.innerHTML=q.info?('<div class="q-info"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="flex-shrink:0;margin-top:1px"><circle cx="7" cy="7" r="6.5" stroke="#1F3B63" stroke-width="1"\/><path d="M7 6.5V10M7 4.5V5" stroke="#1F3B63" stroke-width="1.5" stroke-linecap="round"\/><\/svg><span>'+q.info+'<\/span><\/div>'):"";
  var hw=document.getElementById("q-helper-wrap");
  hw.innerHTML=q.h?('<div class="q-helper">'+q.h+'<\/div>'):"";

  var wrap=document.getElementById("q-opts"); wrap.innerHTML="";

  if(q.type==="language"){ buildLangPanel("lang_test",false); }
  else if(q.type==="language2"){ buildLang2Panel(); }
  else if(q.type==="spouse_lang"){ buildLangPanel("spouse_lang",true); }
  else {
    var grid=document.createElement("div");
    grid.className="opts"+(q.cols?" c"+q.cols:"");
    (q.opts||[]).forEach(function(opt){
      var btn=document.createElement("button");
      btn.className="opt"+(answers[q.id]===opt.v?" sel":"");
      btn.innerHTML='<div class="opt-radio"><div class="opt-dot"><\/div><\/div><span class="opt-lbl">'+opt.l+(opt.s?'<span class="opt-sub">'+opt.s+'<\/span>':"")+'<\/span>';
      btn.onclick=function(){
        answers[q.id]=opt.v; save();
        grid.querySelectorAll(".opt").forEach(function(c){c.classList.remove("sel");});
        btn.classList.add("sel");
        document.getElementById("btn-next").disabled=false;
        setTimeout(function(){if(answers[q.id]===opt.v)nextQ();},260);
      };
      grid.appendChild(btn);
    });
    wrap.appendChild(grid);
    document.getElementById("btn-next").disabled=!answers[q.id];
  }

  var vlen=visibleQs().length;
  document.getElementById("prog-fill").style.width=Math.max(Math.round(((curQ+1)/vlen)*100),5)+"%";
  document.getElementById("prog-cnt").textContent="Question "+(curQ+1)+" of "+vlen;
  document.getElementById("prog-sec").textContent=SECS[q.sec];
  var dotsEl=document.getElementById("prog-dots"); dotsEl.innerHTML="";
  SECS.forEach(function(_,i){var d=document.createElement("div");var cs=vqs[curQ].sec;d.className="pdot"+(i<cs?" done":i===cs?" active":"");dotsEl.appendChild(d);});
  document.getElementById("btn-back").disabled=(curQ===0);
  animateScreen("s-question",fwd?"afw":"abk");
}

function nextQ(){
  var vqs=visibleQs(); var q=vqs[curQ];
  if(q.type!=="language"&&q.type!=="language2"&&q.type!=="spouse_lang"&&!answers[q.id])return;
  if(curQ<vqs.length-1){curQ++;save();renderQ(true);}else showResults();
}
function prevQ(){if(curQ>0){curQ--;save();renderQ(false);}}

function showResults(){
  show("s-results");
  document.getElementById("prog-wrap").style.display="none";
  document.getElementById("quiz-nav").style.display="none";
  try{localStorage.removeItem(SK);}catch(e){}
  var crs=calcCRS(answers),pw=scorePW(answers,crs);
  var paths=getTopPaths(pw),cat=getCategory(crs.total);
  var tips=getBoostTips(answers,crs),docs=getDocs(paths);
  var badge=document.getElementById("r-badge");
  badge.className="res-badge "+cat.cls; badge.textContent=cat.label;
  document.getElementById("r-title").textContent=cat.title;
  document.getElementById("r-sub").textContent=cat.sub;
  document.getElementById("r-crs-num").textContent=crs.total;
  setTimeout(function(){document.getElementById("r-crs-fill").style.width=Math.min(crs.total/1200*100,100)+"%";},100);
  var sp=crs.sp,bd=document.getElementById("r-breakdown"); bd.innerHTML="";
  var rows=[
    {t:"sec",  lbl:"Core / Human Capital Factors",              val:crs.core},
    {t:"sub",  lbl:"Age",                                       val:crs.agePts},
    {t:"sub",  lbl:"Level of education",                        val:crs.eduPts},
    {t:"sub",  lbl:"Official Languages",                        val:crs.engPts+crs.frenchCorePts},
    {t:"sub2", lbl:"First Official Language",                   val:crs.engPts},
    {t:"sub2", lbl:"Speaking ("+CLB_LBL[crs.spkCLB]+")",       val:crs.spkPts},
    {t:"sub2", lbl:"Listening ("+CLB_LBL[crs.lisCLB]+")",      val:crs.lisPts},
    {t:"sub2", lbl:"Reading ("+CLB_LBL[crs.rdgCLB]+")",        val:crs.rdgPts},
    {t:"sub2", lbl:"Writing ("+CLB_LBL[crs.wrtCLB]+")",        val:crs.wrtPts},
    {t:"sub2", lbl:"Second Official Language (French core)",    val:crs.frenchCorePts},
    {t:"sub",  lbl:"Canadian work experience",                  val:crs.canWkPts},
    {t:"sec",  lbl:"Spouse / Partner Factors",                  val:crs.spousePts,hide:!sp},
    {t:"sub",  lbl:"Level of education (spouse)",               val:crs.spouseEduPts,hide:!sp},
    {t:"sub",  lbl:"First Official Language (spouse)",          val:crs.spouseLangPts,hide:!sp},
    {t:"sub2", lbl:"Speaking ("+CLB_LBL[crs.spkCLBsp]+")",    val:crs.spkPtsSp,hide:!sp},
    {t:"sub2", lbl:"Listening ("+CLB_LBL[crs.lisCLBsp]+")",   val:crs.lisPtsSp,hide:!sp},
    {t:"sub2", lbl:"Reading ("+CLB_LBL[crs.rdgCLBsp]+")",     val:crs.rdgPtsSp,hide:!sp},
    {t:"sub2", lbl:"Writing ("+CLB_LBL[crs.wrtCLBsp]+")",     val:crs.wrtPtsSp,hide:!sp},
    {t:"sub",  lbl:"Canadian work experience (spouse)",         val:crs.spouseWorkPts,hide:!sp},
    {t:"sec",  lbl:"Skill Transferability Factors",             val:crs.transfer},
    {t:"sub",  lbl:"Education (max 50 pts)",                    val:crs.eduTrans},
    {t:"sub",  lbl:"Foreign work experience (max 50 pts)",      val:crs.fgnTrans},
    {t:"sub",  lbl:"Certificate of qualification",              val:crs.certPts},
    {t:"sec",  lbl:"Additional Points (max 600 pts)",           val:crs.additional},
    {t:"sub",  lbl:"Provincial nomination",                     val:(answers.provincial_nom==="yes"?600:0)},
    {t:"sub",  lbl:"Study in Canada",                           val:crs.studyPts},
    {t:"sub",  lbl:"Sibling in Canada",                         val:(answers.sibling==="yes"?15:0)},
    {t:"sub",  lbl:"French-language skills (bonus)",            val:crs.frenchBonus},
    {t:"total",lbl:"CRS Grand Total",                           val:crs.total}
  ];
  rows.forEach(function(r){
    if(r.hide)return;
    var row=document.createElement("div");
    row.className="crs-row"+(r.t==="sec"?" sec-hdr":r.t==="sub"?" sub":r.t==="sub2"?" sub2":r.t==="total"?" total-row":"");
    row.innerHTML='<span class="crs-row-lbl">'+r.lbl+'<\/span><span class="crs-row-val">'+r.val+'<\/span>';
    bd.appendChild(row);
  });
  var pc=document.getElementById("r-pathways"); pc.innerHTML="";
  var ranks=[{l:"Top Match",c:"rp1"},{l:"Strong Fit",c:"rp2"},{l:"Worth Exploring",c:"rp3"}];
  paths.forEach(function(key,i){
    var p=PW[key]; if(!p)return;
    var card=document.createElement("div"); card.className="pc"+(i===0?" top":"");
    card.innerHTML='<div class="pc-top"><div class="pc-title">'+p.title+'<\/div><span class="rank-pill '+(ranks[i]?ranks[i].c:"rp3")+'">'+(ranks[i]?ranks[i].l:"Consider")+'<\/span><\/div><div class="pc-tags">'+p.tags.map(function(t){return '<span class="ptag">'+t+'<\/span>';}).join("")+'<\/div><p class="pc-desc">'+p.desc+'<\/p><div class="pc-time"><strong>Estimated Processing:<\/strong> '+p.time+'<\/div><div class="pc-disc"><button class="disc-btn" onclick="toggleDisc(this)">Why this pathway was suggested \u25be<\/button><div class="disc-body"><div class="ilist">'+p.why.map(function(w){return '<div class="iitem"><div class="idot"><\/div>'+w+'<\/div>';}).join("")+'<\/div><\/div><\/div>';
    pc.appendChild(card);
  });
  document.getElementById("r-strengthen").innerHTML=tips.map(function(t){return '<div class="iitem"><div class="idot"><\/div>'+t+'<\/div>';}).join("");
  document.getElementById("r-docs").innerHTML=docs.map(function(d){return '<div class="iitem"><div class="idot" style="background:#88cb34"><\/div>'+d+'<\/div>';}).join("");
  var pm={expressEntry:"Express Entry",pnp:"Provincial",workPermit:"Work Permit",studyPermit:"Study Permit",familySponsorship:"Spousal",visitorVisa:"Visitor",quebecSW:"Provincial"};
  if(paths[0]){var sel=document.getElementById("f-pathway"),t=pm[paths[0]]||"";for(var ii=0;ii<sel.options.length;ii++){if(sel.options[ii].text.toLowerCase().indexOf(t.toLowerCase())>=0){sel.selectedIndex=ii;break;}}}
  window._quiz={crs:crs,paths:paths,cat:cat,tips:tips,docs:docs,answers:JSON.parse(JSON.stringify(answers)),ts:new Date().toISOString()};
}

function toggleDisc(btn){var body=btn.nextElementSibling;body.classList.toggle("open");btn.textContent="Why this pathway was suggested "+(body.classList.contains("open")?"\u25b4":"\u25be");}
function showForm(){show("s-form");}

function emailResults(){
  var q=window._quiz||{};var crs=q.crs||{};var cat=q.cat||{};
  var paths=(q.paths||[]).map(function(k){return PW[k];}).filter(Boolean);
  var tips=q.tips||[];var docs=q.docs||[];
  var date=new Date().toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric"});
  var body=["CAN X GLOBAL - CANADA IMMIGRATION ELIGIBILITY ASSESSMENT","Date: "+date,"",
    "ESTIMATED CRS SCORE: ~"+crs.total+" / 1,200 pts",
    "(Estimate only - not official IRCC. Visit canxglobal.com for exact score)","",
    "BREAKDOWN:",
    "  Core:                 "+crs.core+"    Age:"+crs.agePts+" Edu:"+crs.eduPts+" Lang:"+crs.engPts+" French:"+crs.frenchCorePts+" CanWk:"+crs.canWkPts,
    "    Speaking:"+crs.spkPts+" ("+CLB_LBL[crs.spkCLB]+")  Listening:"+crs.lisPts+" ("+CLB_LBL[crs.lisCLB]+")",
    "    Reading:"+crs.rdgPts+" ("+CLB_LBL[crs.rdgCLB]+")   Writing:"+crs.wrtPts+" ("+CLB_LBL[crs.wrtCLB]+")",
    "  Spouse Factors:       "+(crs.spousePts||0),
    "  Transferability:      "+crs.transfer,
    "  Additional:           "+crs.additional+" (Study:"+crs.studyPts+" Sibling:"+(answers.sibling==="yes"?15:0)+" FrenchBonus:"+crs.frenchBonus+")",
    "","RESULT: "+cat.label,"",cat.title||"",cat.sub||"","",
    "PATHWAYS:",paths.map(function(p,i){return "#"+(i+1)+" "+p.title;}).join("\n"),"",
    "IMPROVEMENTS:",tips.map(function(t){return "- "+t;}).join("\n"),"",
    "GET STARTED: https://canxglobal.com/get-started/",
    "WhatsApp: +1 778 564 3555  |  info@canxglobal.com","",
    "Preliminary estimate only. Not legal advice. Consult a licensed RCIC.",
    "(c) Can X Global Solutions - canxglobal.com"].join("\n");
  window.location.href="mailto:?subject="+encodeURIComponent("My Canada CRS Score - Can X Global")+"&body="+encodeURIComponent(body);
}

function submitForm(){
  var name=document.getElementById("f-name").value.trim();
  var email=document.getElementById("f-email").value.trim();
  var consent=document.getElementById("f-consent").checked;
  var errEl=document.getElementById("f-err");
  if(!name){errEl.textContent="Please enter your full name.";errEl.style.display="block";return;}
  if(!email||email.indexOf("@")<0){errEl.textContent="Please enter a valid email address.";errEl.style.display="block";return;}
  if(!consent){errEl.textContent="Please accept the consent checkbox.";errEl.style.display="block";return;}
  errEl.style.display="none";
  var payload={name:name,email:email,phone:document.getElementById("f-phone").value.trim(),country:document.getElementById("f-country").value.trim(),pathway:document.getElementById("f-pathway").value,notes:document.getElementById("f-notes").value.trim(),quiz:window._quiz||{},submittedAt:new Date().toISOString(),sourceURL:window.location.href};
  console.log("[Can X Global] Submission:",JSON.stringify(payload,null,2));
  show("s-thankyou");
}


function submitIntake(){
  var name  = (document.getElementById("i-name")||{}).value||"";
  var email = (document.getElementById("i-email")||{}).value||"";
  var phone = (document.getElementById("i-phone")||{}).value||"";
  var errEl = document.getElementById("intake-err");
  if(!name.trim()){errEl.textContent="Please enter your name.";errEl.style.display="block";return;}
  if(!email.trim()||email.indexOf("@")<0){errEl.textContent="Please enter a valid email address.";errEl.style.display="block";return;}
  errEl.style.display="none";
  // Save intake data for later use in lead form
  window._intake={
    name:name.trim(), email:email.trim(),
    phone:(document.getElementById("i-phone")||{}).value||"",
    country:(document.getElementById("i-company")||{}).value||"",
    message:(document.getElementById("i-message")||{}).value||""
  };
  // Pre-fill the lead form
  var fn=document.getElementById("f-name"),fe=document.getElementById("f-email");
  var fp=document.getElementById("f-phone"),fc=document.getElementById("f-country");
  if(fn&&!fn.value) fn.value=window._intake.name;
  if(fe&&!fe.value) fe.value=window._intake.email;
  if(fp&&!fp.value) fp.value=window._intake.phone;
  if(fc&&!fc.value) fc.value=window._intake.country;
  show("s-intro");
}

function show(id){document.querySelectorAll(".screen").forEach(function(s){s.classList.remove("active","afw","abk");});document.getElementById(id).classList.add("active","afw");}
function animateScreen(id,cls){var el=document.getElementById(id);el.classList.remove("afw","abk");void el.offsetWidth;el.classList.add(cls);}

document.addEventListener("DOMContentLoaded",function(){
  var saved=load();
  if(saved&&started&&curQ>0){
    if(confirm("Welcome back! Continue where you left off?")){
      show("s-question");
      document.getElementById("prog-wrap").style.display="block";
      document.getElementById("quiz-nav").style.display="flex";
      renderQ(true);return;
    }
    curQ=0;answers={};started=false;try{localStorage.removeItem(SK);}catch(e){}
  }
  show("s-intake");
});

