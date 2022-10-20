const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

//-------
const DEFAULT_CACHE_PATH = `${ this.basePath }/cache`;
//-------

//-------
const CACHE_PATH = this.checkAlias("@cache")
  ? this.pathToAlias("@cache")
  : DEFAULT_CACHE_PATH;
//----

module.exports.basePath = =>path.resolve("./")

module.exports.capitalizeFirstLetter=(string)=> 
   string.charAt(0).toUpperCase() + string.slice(1)

module.exports.toKebabCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-');

module.exports.pathToAlias=(path) => {
  if(path.startsWith("@")){
    const packageJson = require(`${ this.basePath }/package.json`);
    const pathParts = path.split('/');
    const alias=packageJson._moduleAliases[pathParts[0]]
    return `${alias}/${pathParts.slice(1).join('/')}`;
  } else
     return path
}

module.exports.checkAlias=(path) => {
  const firstPart=this.pathToAlias(path).split("/")[0]
  return firstPart=="undefined"
    ? false
    : true
}

module.exports.file={
  read: (path) => 
    fs.readFileSync(this.pathToAlias(path),"utf-8").toString(),

  write: ({path,content,cb}) => {
    const getDirName = path.dirname
    const aliasPath = this.pathToAlias(path)
  
    fs.mkdir(getDirName(aliasPath), {recursive: true}, function (err) {
      if (err) return cb(err);
  
      fs.writeFileSync(aliasPath, content, cb);
    });
  },

  copy: (selectedPath,targetPath)=> 
     fs.copySync(this.pathToAlias(selectedPath), this.pathToAlias(targetPath)),
  
  delete: (selectedPath)=> 
     fs.removeSync(this.pathToAlias(selectedPath)),

  exists: (path) => fs.existsSync(this.pathToAlias(path)),

  glob:(path)=>  glob.sync(this.pathToAlias(path)),

  stat:(path)=>  fs.lstatSync(this.pathToAlias(path)),

  rename:(selectedPath,targetPath)=> 
   fs.renameSync(this.pathToAlias(selectedPath), this.pathToAlias(targetPath)),
}


//--------------------------------------------

module.exports.cache={
  create:(cacheName,cacheData)=>{
    const CACHE_FILE_PATH=`${CACHE_PATH}/${cacheName}.js`
    const oldCacheData = require(CACHE_FILE_PATH);
    
    const newCacheData={
      ...oldCacheData,
      ...cacheData
    }

    this.file.create({
      path:CACHE_FILE_PATH,
      content:`module.exports=${JSON.stringify(newCacheData)}`
    })
  },
  read:(cacheName,key=null)=>{
    const CACHE_FILE_PATH=`${CACHE_PATH}/${cacheName}.js`
    const cacheTools = require(CACHE_FILE_PATH);
    return key
      ? cacheTools[key]
      : cacheTools
  }
}