var Freemarker = require('freemarker.js');
var root = fis.project.getProjectPath();

var fm = new Freemarker({
    viewRoot: root
});

/**
 * ��ȡmock����
 * @param  {Object} file fis �� File ����
 * @return {Object}      mockData
 */
function mockData(file) {
    var data = {},
        mockFilePath = file.subpathNoExt.replace('/html/', '/data/') + '.json',
        mockFile = fis.file(root, mockFilePath);

    if (mockFile.exists()) {
        try {
            data = JSON.parse(mockFile.getContent());
        } catch (e) {
            fis.log.warn('mock data parse error:' + mockFilePath);
        }
    } else {
        // fis.log.warn('not found mock data file:' + mockFilePath);
    }
    return data;
}


/**
 * ����freemarkerģ��
 * @param  {string} content     �ļ�����
 * @param  {File}   file        fis �� File ���� [fis3/lib/file.js]
 * @param  {object} settings    �����������
 * @return {string}             �������ļ�����
 */
module.exports = function(content, file, settings) {
    try {
        content = fm.renderSync(file.subpath, mockData(file));
    }
    catch (e) {
        fis.log.warn('Got error: %s while parsing `%s`.%s', e.message.red, file.subpath, e.detail || '');
        fis.log.debug(e.stack);
    }
    return content;

};
