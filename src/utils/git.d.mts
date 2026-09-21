/**
 * 返回文件在 git 中的最后提交时间；git 不可用/未跟踪时返回 null。
 * @param filePath 相对仓库根目录的路径（正斜杠）
 */
export declare function gitLastModified(filePath: string): Date | null;
