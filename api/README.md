# api 接口说明

## CheckFile（GET）

> 检查文件是否存在或存在的分片

### request

```ts
{
  hash: string, // 文件hash值（整个文件）
  fileName: string, // 文件名称
}
```

### response

```ts
{
  /**
   * 0: 文件不存在
   * 1: 文件已存在
  */
  exist: 0 | 1,
  /**
   * 已经存在的分片（不要再上传）
  */
  chunks: string[],
  /**
   * 已存在的文件名
  */
  file: string,
}
```

## File（post）

> 上传文件（分片）（分片大小`1/4GB`）

## request

```ts
const fd = new FormData()
fd.append('file', chunk) // 文件（分片）
fd.append('hash', hash) // 文件hash值（整个文件）
fd.append('fileName', file.name) // 文件名
fd.append('index', index) // 分片索引（0开始），不传表示为整文件
```

## response

```ts
{
  file: string, // 访问文件名
}
```

## MergeFile（post）

> 合并文件分片

## request

```ts
{
  hash: string, // 文件hash值（整个文件）
  fileName: string, // 文件名称
}
```

## response

```ts
{
  file: string, // 合并后的文件名
}
```

## File/:filename（get）

> 访问上传的文件
