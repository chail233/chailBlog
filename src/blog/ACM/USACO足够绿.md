---
title: "[USACO21FEB] Just Green Enough S（单调栈）"
date: 2026-03-25T23:50:35+08:00
draft: false
categories:
  - "算法足迹"
---


# [USACO21FEB] Just Green Enough S（单调栈）
> 正值春季，各省程序设计竞赛即将开始。本人尽管学识浅薄，能力平平，还是希望能够参加省赛。于是便参加了学校的选拔赛，喜提只AC1题并吃了8发罚时。今天的这道题便是选拔赛的第二题，我承认我还是太弱。我今年还有机会参加省赛吗？
## 题目
# P7410 [USACO21FEB] Just Green Enough S

## 题目描述

Farmer John 的草地可以被看作是一个由 $N \times N$ 个正方形方格（$1 \leq N \leq 500$）组成的方阵（想象一个巨大的棋盘）。由于土壤变异性，某些方格中的草可能更绿。每个方格 $(i,j)$ 可以用一个整数绿度值 $G(i,j)$ 来描述，范围为 $1 \ldots 200$。

Farmer John 想要给他的草地的一个子矩阵拍摄一张照片。他希望确保这一子矩阵看上去足够绿，但又不绿得过分，所以他决定拍摄一个 $G$ 的最小值恰好等于 100 的子矩阵。请帮助他求出他可以拍摄多少不同的照片。子矩阵最大可以为整个草地，最小可以仅为一个方格（共有 $N^2(N+1)^2/4$ 个不同的子矩阵——注意该数可能无法用 $32$ 位整数型存储，所以你可能需要使用 $64$ 位整数类型，例如 C++ 中的 long long）。

## 输入格式

输入的第一行包含 $N$。以下 $N$ 行每行包含 $N$ 个整数，表示 $N \times N$ 草地的 $G(i,j)$ 值。

## 输出格式

输出 Farmer John 可以拍摄的不同的照片数量——也就是说，最小绿度值等于 $100$ 的子矩阵数量。

注意这个问题涉及到的整数大小可能需要使用 $64$ 位整数型存储（例如，C/C++ 中的 long long）。

## 输入输出样例 #1

### 输入 #1

```
3
57 120 87
200 100 150
2 141 135
```

### 输出 #1

```
8
```

## 说明/提示

#### 测试点性质：

 - 对于 $50\%$ 的数据，满足 $N\le 200$。
 - 对于另外 $50\%$ 的数据，没有额外限制。
---
## 题解
### 题意
题意很简单，给了一个矩阵，找其中所有的最小值为$100$的子矩阵。
### 思考
先思考一下，最小值为$100$的子矩阵有什么特点？

废话，当然是最小值为$100$了....如果单单只对这个特点下手，便会发现似乎有些困难。我们不太好处理去获取最小值为$100$的矩阵。不妨去分解这个条件：

1. 所有元素大于等于$100$。
2. 一定存在等于$100$的元素。

分解成这两个条件，就好处理了。我们可以先找出符合条件1的子矩阵数量，此时这个数量包含了那些可能没有$100$的子矩阵，因此我们还需要去掉这些不合法的子矩阵，也就是所有元素都大于$100$的子矩阵数量，将这两个数量相减，便可以得到最小值为$100$的子矩阵数量了。

我们可以把题目给的矩阵g依据上述条件构造为两个01矩阵$g1$、$g2$。
```cpp
for (int i=1;i<=n;++i) {
        for (int j=1;j<=n;++j) {
            if (g[i][j]>=100) g1[i][j] = 1;
            else g1[i][j] = 0;
            if (g[i][j]>100) g2[i][j] = 1;
            else g2[i][j] = 0;
        }
    }
```
这样我们只要统计这两个矩阵中的所有全1子矩阵就可以了。
### 单调栈处理
可是怎么去统计呢，这似乎也不好下手。

注意到题目的范围$n$比较小，我们可以用$O(n^2)$解决。

利用单调栈对于每一个子矩阵右下角做处理是可行的。

$pr$维护的是以当前列为右边界的子矩阵个数，这些子矩阵的高度可以是 $1$ 到某个最大值的任意值。

当处理新列时：

弹出操作：移除那些因为当前列高度限制而无法延伸的矩形。

那些高度大于当前列的矩形，无法延伸到当前列。

所以要从 $pr$ 中减去它们。

宽度累计：被弹出的矩形所覆盖的列，都可以作为当前高度为$ h[j]$ 的矩形的左边界,所以累加它们的宽度。

入栈操作：新列的高度 $h[j]$ 可以向左延伸到所有被弹出列的范围。

贡献是$ h[j] × width$，这包含了所有以当前列为右边界的矩形。
```cpp
int count(int mat[505][505], int n) {
    int h[505] = {0};
    int res = 0;
    for (int i=1;i<=n;++i) {
        for (int j=1;j<=n;++j) {
            if (mat[i][j]==1) {
                h[j]++;
            }
            else h[j] = 0;
        }
        stack<pair<int,int>> s;
        int pr = 0;
        for (int j=1;j<=n;++j) {
            int w = 1;
            while (!s.empty() && s.top().first>=h[j]) {
                pair<int,int> p = s.top();
                s.pop();
                pr -= p.first * p.second;
                w += p.second;
            }
            s.push({h[j], w});
            pr += h[j] * w;
            res += pr;
        }
    }
    return res;
}
```
### 完整代码
```cpp
#include <bits/stdc++.h>
#define int long long
using namespace std;
int g[505][505];
int g1[505][505];
int g2[505][505];
int count(int mat[505][505], int n) {
    int h[505] = {0};
    int res = 0;
    for (int i=1;i<=n;++i) {
        for (int j=1;j<=n;++j) {
            if (mat[i][j]==1) {
                h[j]++;
            }
            else h[j] = 0;
        }
        stack<pair<int,int>> s;
        int pr = 0;
        for (int j=1;j<=n;++j) {
            int w = 1;
            while (!s.empty() && s.top().first>=h[j]) {
                pair<int,int> p = s.top();
                s.pop();
                pr -= p.first * p.second;
                w += p.second;
            }
            s.push({h[j], w});
            pr += h[j] * w;
            res += pr;
        }
    }
    return res;
}
signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
    int n;
    cin >> n;
    for (int i=1;i<=n;++i) {
        for (int j=1;j<=n;++j) cin >> g[i][j];
    }
    for (int i=1;i<=n;++i) {
        for (int j=1;j<=n;++j) {
            if (g[i][j]>=100) g1[i][j] = 1;
            else g1[i][j] = 0;
            if (g[i][j]>100) g2[i][j] = 1;
            else g2[i][j] = 0;
        }
    }
    int cnt1 = count(g1, n);
    int cnt2 = count(g2, n);
    cout << cnt1-cnt2 << endl;
    return 0;
}
```
## 总结
这道题对我有点难，需要把问题转化，并且需要利用一些好的处理方法如单调栈来计数。应该好好学习这种转化。
