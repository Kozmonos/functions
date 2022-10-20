## basePath

Get base path of the project.

## capitalizeFirstLetter

**parameters:** string

Capitalize first letter of the string.

## toKebabCase

**parameters:** string

Convert string to kebab case.
## pathToAlias

**parameters:** path

Convert path to alias.
## checkAlias

**parameters:** path

Check if alias is valid.

## file
- ### read
	
	**parameters:** path
- ### write
	
	**parameters:** {path,content,cb}
- ### copy
	
	**parameters:** selectedPath,targetPath
- ### delete
	
	**parameters:** selectedPath
- ### exists
	
	**parameters:** path
- ### glob
	
	**parameters:** path
- ### stat
	
	**parameters:** path
- ### rename
	
	**parameters:** selectedPath,targetPath

## cache
- ### create

	**parameters:** cacheName,cacheData
- ### read

	**parameters:** cacheName,key=null
