(function(){
    
    var fs = require('fs');
    var iconv = require('iconv-lite');
    var os = require('os');
    var BrowserWindow = require('electron').remote.BrowserWindow;
    var screen = require('electron').remote.screen;

    var stepParser = require('../../common/stepparser.js');

    var that = exports,
        tmpdir;

that.export = function(){
    var root = localStorage.getItem('projectDir');
    tmpdir = os.tmpDir() + "/rdpide";

    initTmpdir(tmpdir);
    var stepSource = scanStep(root + "/step");
    console.info(stepSource);

    buildIndexMD(stepSource);

    showDocView();
}

/**
 * 导出单个step文档
 */
that.exportStep = function(filename){
    var root = localStorage.getItem('projectDir');
    tmpdir = os.tmpDir() + "/rdpide";
    initTmpdir(tmpdir);
    
    var filepath = root + "/step/" + filename;
    var stepSource = stepParser.parse(filepath);

    try{
        buildStepMD(filename, stepSource, {disableGoback: true});
    }catch(e){
        console.debug(source);
        console.error(e);
    }
}


//----------------------------内部方法分界线--------------------------------------------------
/**
 * 扫描流程路径， 解析每个流程文件的doc信息。
 */
function scanStep(stepdir) {
    var stepSource = {};
    var files = fs.readdirSync(stepdir);
    for(index in files){
        var filename = files[index];
        var filepath = stepdir + "/" + filename, step = "";
        stepSource[filename] = stepParser.parse(filepath);
        stepSource[filename].path = filepath;
    }

    // stepSource.length = files.length;
    return stepSource;
}

/**
 * 清空临时文件夹
 */
function initTmpdir(tmpdir) {
    deleteFolderRecursive(tmpdir);
    fs.mkdirSync(tmpdir);
    fs.mkdirSync(tmpdir + "/step");
    fs.writeFileSync(tmpdir + "/index.html", fs.readFileSync(__dirname + '/mdwiki-debug.html'));
}

/**
 * 清空目标文件夹
 */
function deleteFolderRecursive (path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

/**
 * 生成流程doc，md文件
 */
function buildIndexMD(stepSource) {
    var indexmd = tmpdir + "/index.md";
    var rowsize = 4, index=0;
    var modules = {};

    for(stepid in stepSource){
        var source = stepSource[stepid];
        var moduleid = source.module || '';
        moduleid = moduleid == '' ? 'none' : moduleid;

        if(!modules[moduleid]) 
            modules[moduleid] = [];
        
        var rowContent = '['+stepid+'](step/'+stepid+'.md) <br><small>'+source.remark+'</small>';
        modules[moduleid].push(rowContent);

        try{
            buildStepMD(stepid, source);
            index++;
        }catch(e){
            console.debug(source);
            console.error(e);
        }
        
        
    }

    console.debug('modules=%o', modules);
    var content = [];
    for(moduleid in modules){
        content.push(
            '## 模块-'+moduleid + '\n' +
            buildModuleContent(modules[moduleid], rowsize)
        );
    }
    content = content.sort();
    fs.writeFileSync(indexmd, content.join('\n'));
}

function buildModuleContent(module, rowsize) {
    rowsize = rowsize > module.length ? module.length : rowsize;
    var mContent = [];
    var header = module.slice(0, rowsize);

    mContent.push(header.join('|'));
    mContent.push(rowsize == 1 ? '--' : new Array(rowsize).join('---|---'));

    var index = rowsize;
    while(index < module.length){
        var end = index + rowsize;
        end = end > module.length ? module.length : end;
        mContent.push(module.slice(index, end).join('|'));

        index += rowsize;
    }

    // console.debug(mContent);
    return '|' + mContent.join('|\n|') + '|';
}

/**
 * 生产单个step文档
 */
function buildStepMD(id, step, options) {
    var group = step.stepGroup;
    var mdpath = tmpdir + "/step/" + id + ".md";
    var mdcontent = ['#'+id + ' <small>'+step.remark+'</small>'];

    options = options || {};
    var disableGoback = options.disableGoback;
    
    disableGoback ? '' : mdcontent.push(' [<<返回](../index.md)');
    mdcontent.push('## 功能说明');
    mdcontent.push('```');
    mdcontent.push(step.doc);
    mdcontent.push('```');

    mdcontent.push('## 流程出口');
    mdcontent.push(buildMdTable([group.CallReturn, group.JumpStep], {
        head: ['序号', 'ID', '类型', '返回/跳转目标'],
        align: ['---', '---', '---', '---'],
        row: function(dataType, index, rowData){
            return [index, rowData.id, dataType == 0 ? 'CallReturn':'JumpStep', 
                dataType == 0 ? rowData.params.Ret : rowData.params.Step + '.' + rowData.params.Node];
        }
    }));
    

    mdcontent.push('## 相关流程-CallStep');
    mdcontent.push(buildMdTable(group.CallStep, {
        head: ['序号', 'ID', 'remark', '目标流程'],
        align: ['---', '---', '---', '---'],
        row: function(dataType, index, rowData){
            var param = rowData.params;
            return [index, rowData.id, rowData.remark, param.Step + '.' + param.Node];
        }
    }));

    mdcontent.push('## 相关脚本-RunScript');
    mdcontent.push(buildMdTable(group.RunScript, {
        head: ['序号', 'ID', 'remark', '目标脚本', '脚本参数'],
        align: ['---', '---', '---', '---', '---', '---'],
        row: function(dataType, index, rowData){
            var param = rowData.params;
            return [index, rowData.id, rowData.remark, param.FileName + '->' + param.FunName,
                param.FunParam];
        }
    }));

    mdcontent.push('## 相关页面');
    mdcontent.push(buildMdTable([group.KeybdInputData, group.ShowPage], {
        head: ['序号', 'ID', 'remark', '类型', '页面名称'],
        align: ['---', '---', '---', '---', '---', '---'],
        row: function(dataType, index, rowData){
            var param = rowData.params;
            return [index, rowData.id, rowData.remark, 
                dataType == 0 ? 'KeybdInputData':'ShowPage',
                param.PageName ];
        }
    }));

    // mdcontent.push('## 流程图');
    

    fs.writeFileSync(mdpath, mdcontent.join('\n'));
}

/**
 * 构建md表格数据
 */
function buildMdTable(tableData, options) {
    if(tableData instanceof Array){
    }else{
        tableData = [tableData];
    }

    var rows = [], index = 1;
    for(var i=0; i<tableData.length; i++){
        for(id in tableData[i]){
            var row = options.row(i, index++, tableData[i][id]);
            rows.push('|'+row.join('|')+'|');
        }
    }

    if(rows.length > 0){
        return '|'+options.head.join('|')+'|\n' +
            '|' + options.align.join('|') + '|\n' +
            rows.join('\n');
    }else{
        return '';
    }
}

function showDocView(argument) {
    var size = screen.getPrimaryDisplay().workAreaSize
    // var win = new BrowserWindow({backgroundColor: '#2e2c29', height: size.height, width: 1054});
    // win.on('closed', ()=>{win = null});

    var url = 'file://'+__dirname+'/rdpdoc.html';
    console.info(url);
    // win.loadURL(url);

    var docwin = window.open(url, "", "height="+size.height+",width=1054");
}

}())