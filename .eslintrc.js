module.exports = {
    'env': {
        'node': true,
        'commonjs': true,
        'es2021': true,
        'jest': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [  //语句后使用分号
            'error',
            'always'
        ],
        'no-trailing-spaces': 'error',  //避免行的末尾有不必要的空格
        'object-curly-spacing': [  //大括号前后需要空格
            'error', 'always'
        ],
        'arrow-spacing': [  //箭头函数 => 前后需要空格
            'error', { 'before': true, 'after': true }
        ]
    }
};
