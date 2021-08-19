import store from '../store'
import axios from 'axios'
import { apiFindDicByCode } from '@/api/apiBaseInfo'

export function deleteNullKey(obj) {
    try {
        Object.keys(obj).forEach((key) => {
            if (obj[key] === undefined || obj[key] === null || obj[key] === '') delete obj[key]
        })
    } catch (res) {
        console.log(res)
    }
}

export function deepCopy(obj) {
    //判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
    let objClone = Array.isArray(obj) ? [] : {}
    //进行深拷贝的不能为空，并且是对象或者是
    if (obj && typeof obj === 'object') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === 'object') {
                    objClone[key] = deepCopy(obj[key])
                } else {
                    objClone[key] = obj[key]
                }
            }
        }
    }
    return objClone
}

export function uploadImgToOSS(img) {
    return new Promise(function(rep, rej) {
        try {
            let names = img.name.split('.')
            let result = client.put('imgs/' + names[0] + new Date().getTime() + '.' + names[1], img)
            rep(result)
        } catch (err) {
            rej(err)
        }
    })
}

export function exportExcelFromJson(fileName, title, data) {
    let str = []
    for (let key in title) {
        str.push(title[key])
    }
    str = str.join(',') + '\n'
    for (let i = 0; i < data.length; i++) {
        for (let key in title) {
            str += `${data[i][key] || '' + '\t'},`
        }
        str += '\n'
    }
    //encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
    //通过创建a标签实现
    let link = document.createElement('a')
    link.href = uri
    //对下载的文件命名
    link.download = fileName + new Date().Format('yyyy-MM-dd hh:mm:ss') + '.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// 数据稍微调整下
export function downLoadExcel(fileName, columns, data = []) {
    let title = columns.map((item) => item.title)
    title = title.filter((item) => item !== '操作')
    let nameKeyArr = columns.map((item) => item.dataIndex)
    // 不要 action 里面的内容
    nameKeyArr = nameKeyArr.filter((item) => item !== 'action')
    data = data.map((row) => {
        // 每行的内容 集合
        let rowContent = nameKeyArr.map((key) => row[key])
        return rowContent
    })
    exportExcelFromJson(fileName, title, data)
}

export function secondTurnMinutes(value) {
    var theTime = parseInt(value)
    let middle = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime < 10) {
        theTime = '0' + theTime
    }
    if (middle < 10) {
        middle = '0' + middle
    }
    return middle + ':' + theTime
}

export function getAreaById(id) {
    return store.state.areaData.find((item) => item.mapRegionId === id)
}

export function getStationById(id) {
    return store.state.stationList.find((item) => item.stationId === id)
}

/**
 *  对象转换为数组
 * @param {} obj
 * @returns
 */
export function deepObjectToArr(obj) {
    let arr = []
    console.log(obj != null && typeof obj === 'object')
    if (obj != null && typeof obj === 'object') {
        for (var key in obj) {
            console.log(!obj.hasOwnProperty(key))
            if (!obj.hasOwnProperty(key)) {
                continue
            }
            var item = {}
            arr.push(obj[key])
        }
    }
    return arr
}

/**
 *  给对象数组添加属性
 * @param {} obj
 * @returns
 */
export function addPropertyToObjectArr(arr, key, defaultValue) {
    if (!Array.isArray(arr)) {
        throw new Error('arr required be Array')
    }
    return arr.map((item) => {
        return {
            ...item,
            [key]: defaultValue,
        }
    })
}

/**可以将common里的map 转换为key-value 的map */
export function turnCommonMapToKeyValue(originMap) {
    const map = Object.create(null)
    Object.keys(originMap).forEach((key) => {
        const { label, value } = originMap[key]
        map[value] = label
    })
    return map
}

// 自定义防抖函数
export function debounce(fn, wait, immediate = false) {
    let timeout // 定时器对象
    let result // handleUserAction函数的执行结
    console.log('debounce function this ', this) //这里的this指向是window对象
    return function() {
        console.log(this) //这里的this指向的是div元素，这是因为return 返回函数已经替换了fn传递的函数，fn里的this指向的是div元素
        let context = this
        let args = arguments //修改参数
        if (timeout) {
            clearTimeout(timeout)
        }

        if (immediate) {
            // 立即执行的话
            let callNow = !timeout
            timeout = setTimeout(function() {
                timeout = null
            }, wait)

            if (callNow) {
                result = fn.apply(context, args) //这是是使用apply来改变this的指向，如果不使用debounce函数的时候，this就是container DOM元素；当使用之后，this指向window?(已解决)
                //如果不使用debounce函数的时候，handleUserAction的参数就是Event； 使用之后变成undefined?
            }
        } else {
            // 传统的方式的执行的话
            timeout = setTimeout(function() {
                console.log(this)
                // 由于这里实际上就是一个异步的执行结果，所有此时的result最后每次都会返回的是一个undefined
                result = fn.apply(context, args)
            }, wait)
        }
    }
}

// 节流
export function throttle(fn, wait) {
    var timer = null
    return function() {
        var context = this
        var args = arguments
        if (!timer) {
            timer = setTimeout(function() {
                fn.apply(context, args)
                timer = null
            }, wait)
        }
    }
}

// 設置樹形結構層級索引
export function setTreeHierarchyIndex(data, maxLevel, preLevelIndex, currLevel = 0) {
    if (!(data instanceof Array)) throw new TypeError('The data should be an array!')
    let result = []
    let len = data.length
    for (let k = 0; k < len; k++) {
        let hierarchyIndex = k + 1
        if (preLevelIndex) {
            hierarchyIndex = preLevelIndex + '-' + (k + 1)
        }
        let temp = data[k]
        let newNode = {
            ...temp,
            hierarchyIndex,
            children: null,
        }
        delete newNode.children
        //是否在指定层级范围
        if (maxLevel && currLevel >= maxLevel) {
            continue
        }
        if (temp.children && temp.children.length > 0) {
            currLevel++ // 执行下一层级 当前层级+ 1
            newNode.children = setTreeHierarchyIndex(temp.children, maxLevel, hierarchyIndex, currLevel)
            currLevel-- // 执行完成后, 回到上一层级
        }
        result.push(newNode)
    }
    return result
}

// 根据数组返回树结构 key 为树的唯一键 ,parentKey 为父节点key
export function buildTree(list, key, parentKey) {
    if (!key && typeof key !== 'string') {
        throw new Error('key is must be string')
    }
    if (!parentKey && typeof parentKey !== 'string') {
        throw new Error('parentKey is must be string')
    }
    let temp = {}
    let tree = []
    list.forEach((data) => {
        temp[data[key]] = {
            ...data,
            key: data[key],
        }
    })
    for (let i in temp) {
        let tempIData = temp[i]
        const parentId = tempIData[parentKey]
        if (parentId && temp[parentId]) {
            let children = temp[parentId].children
            children = children ? children : []
            children.push(tempIData)
            temp[parentId].children = children
        } else {
            tree.push(tempIData)
        }
    }
    return tree
}

// 下载文件、图片、视频...
export function onDownLoadFiles(item) {
    console.log(item)
    let type = null
    if (item.extName === 'png') {
        type = 'image/png'
    }
    axios({
        method: 'get',
        url: item.fileUrl,
        responseType: 'blob', // 1.首先设置responseType对象格式为 blob: // 二进制流
    }).then((res) => {
        let blob = new Blob([res.data], {
            type: type || 'application/vnd.ms-excel',
        }) // 2.获取请求返回的response对象中的blob 设置文件类型，这里以excel为例
        let url = window.URL.createObjectURL(blob) // 3.创建一个临时的url指向blob对象

        // 4.创建url之后可以模拟对此文件对象的一系列操作，例如：预览、下载
        let a = document.createElement('a')
        a.href = url
        a.download = item.fileName + item.extName
        a.click()
        // 5.释放这个临时的对象url
        window.URL.revokeObjectURL(url)
    })
}

/**
 *权限验证
 */
export function checkPermission(route) {
    if (!route) return true
    if (!route.sysFunctionId) return true
    return store.state.sysFunctionIds.indexOf(route.sysFunctionId) !== -1
}

//  判断两个对象的值是否相等
export function isEqual(a, b) {
    //如果a和b本来就全等
    if (a === b) {
        //判断是否为0和-0
        return a !== 0 || 1 / a === 1 / b
    }
    //判断是否为null和undefined
    if (a == null || b == null) {
        return a === b
    }
    //接下来判断a和b的数据类型
    var classNameA = toString.call(a),
        classNameB = toString.call(b)
    //如果数据类型不相等，则返回false
    if (classNameA !== classNameB) {
        return false
    }
    //如果数据类型相等，再根据不同数据类型分别判断
    switch (classNameA) {
        case '[object RegExp]':
        case '[object String]':
            //进行字符串转换比较
            return '' + a === '' + b
        case '[object Number]':
            //进行数字转换比较,判断是否为NaN
            if (+a !== +a) {
                return +b !== +b
            }
            //判断是否为0或-0
            return +a === 0 ? 1 / +a === 1 / b : +a === +b
        case '[object Date]':
        case '[object Boolean]':
            return +a === +b
    }
    //如果是对象类型
    if (classNameA == '[object Object]') {
        //获取a和b的属性长度
        var propsA = Object.getOwnPropertyNames(a),
            propsB = Object.getOwnPropertyNames(b)
        if (propsA.length != propsB.length) {
            return false
        }
        for (var i = 0; i < propsA.length; i++) {
            var propName = propsA[i]
            //如果对应属性对应值不相等，则返回false
            if (a[propName] !== b[propName]) {
                return false
            }
        }
        return true
    }
    //如果是数组类型
    if (classNameA == '[object Array]') {
        if (a.toString() == b.toString()) {
            return true
        }
        return false
    }
}

//cascader 组件反向查找所有上级
export function findParent(originMap, key, parentIdArr = []) {
    parentIdArr.push(key)
    const parentId = originMap[key]
    if (parentId) {
        return findParent(originMap, parentId, parentIdArr)
    }
    return parentIdArr.reverse()
}

// 枚举值转map（common.js) labelField 返回字段
export function enumToMap(origin, labelField = 'label') {
    const map = {}
    Object.keys(origin).map((key) => {
        map[origin[key].value] = labelField === '$all' ? origin[key] : origin[key][labelField]
    })
    return map
}

// 枚举值转数组（common.js)
export function enumToArray(origin) {
    const array = []
    Object.keys(origin).map((key) => {
        array.push({
            ...origin[key],
        })
    })
    return array
}

// 获取数据字典
// valueType类型（string,number)
export async function findDic(dicId, valueType = 'number') {
    if (!dicId) {
        return
    }
    const arrayData = [],
        mapData = {}
    const params = {
        sysDictCategoryId: dicId,
    }
    await apiFindDicByCode(params).then((res) => {
        if (res.code === 200 && res.data && res.data instanceof Array) {
            res.data.map((item) => {
                const addItem = {
                    label: item.label,
                    value: valueType === 'number' ? Number(item.val) : String(item.val),
                }
                arrayData.push(addItem)
                mapData[item.val] = addItem.label
            })
        }
    })

    return { arrayData, mapData }
}
// 获取两个数组的差集 返回Arr1 有 而 arr2 没有的元素
export function getDiffFromArr(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        return []
    }
    return arr1.filter(function(val) {
        return arr2.indexOf(val) === -1
    })
}

// 数字小写转换成大写
export const toChinesNum = (num) => {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'] //changeNum[0] = "零"
    let unit = ['', '十', '百', '千', '万']
    num = parseInt(num)
    let getWan = (temp) => {
        let strArr = temp
            .toString()
            .split('')
            .reverse()
        let newNum = ''
        for (var i = 0; i < strArr.length; i++) {
            newNum =
                (i == 0 && strArr[i] == 0
                    ? ''
                    : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
                    ? ''
                    : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) + newNum
        }
        return newNum
    }
    let overWan = Math.floor(num / 10000)
    let noWan = num % 10000
    if (noWan.toString().length < 4) noWan = '0' + noWan
    return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}
