# api/v1 接口说明

## CheckFile（GET）

> 检查文件是否存在或存在的分片

### request

```ts
{
  hash: string,
  fileName: string,
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
