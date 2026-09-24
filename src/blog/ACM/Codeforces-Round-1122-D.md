---
title: "Codeforces Round 1122 D-Falling Concrete"
date: 2026-09-24
draft: false
description: "Codeforces Round 1122 D-Falling Concrete题解"
categories:
  - "算法足迹"
---
> 有很长时间没有写算法笔记了，上一次还是暑期集训学费用流...

> 原因主要是期间训练很累无心写题解，其次是训练后也没怎么学算法，发现自己还是好区啊。

---
## 题目
![](https://img.wemd.app/1790229735437_97dmaq.png)

## 样例
![](https://img.wemd.app/1790229770969_nhyplo.png)

## 题解

### 题目大意
给了一个数组 a，我们可以任意次如下操作：
- 选定 $i$,$j$, ($1≤i<j≤n$)
- 将 $a_i$ 至 $a_{j−1}$ 各加 $1$，并将 $a_j$ 插入到 $a_i$ 之前。

### 思考
这道题很好理解也很好写，只是的确需要一点观察力...我承认我的确没有。

从这个操作我们可以发现，把一个数字右移一位会使它加一，把一个数字左移一位会使它减一。也就是，数字的变化和它的位置有关。

设数组某个元素的值为 $v$，位置（下标）为 $i$。当 $i \to i+1$，得到 $v \to v+1$。我们可以发现，位置和数值是同步变化的，也就是说 $v$ 和 $i$ 的差始终是不变的。

将给定数组的所有元素转换为 $v$ 和 $i$ 的差，它们当前的真实值就等于转换后的 $v$ 加上当前的 $i$。现在我们可以任意排列转换后的数组，为了使数组连续相同的真实值最多，我们要使一段加上 $i$ 的序列尽可能长。$i$ 是随着下标每次递增 $1$ 的，因此我们要找到转换后的数组重排后的最长的公差为 $−1$ 的等差数列的长度。

具体来讲只要给转换后的数组排序再去重就可以直接统计了。

### 代码
```
#include <bits/stdc++.h>
using namespace std;
constexpr int MAXN = 2e5+5;
array<int, MAXN> a;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        for (int i=1;i<=n;++i) {
            int ai;
            cin >> ai;
            a[i] = ai-i;
        }
        sort(a.begin()+1, a.begin()+1+n);
        auto last = unique(a.begin()+1, a.begin()+1+n);
        int res = 1;
        for (int i=1, j=1;i<=n;++i) {
            res = max(res, i-j+1);
            if (i==*last || i+1>n) break;
            if (a[i]+1!=a[i+1]) {
                j = i+1;
            }
        }
        cout << res << "\n";
    }
    return 0;
}
```

~~不是我不发难题题解，是我也不会啊~~