Привет, мир!

@mermaid
    graph TD
        root[Комбинация]:::featured --> question{{Порядок элементов важен?}}

        question -->|Да| arrangement[Размещение]:::featured
        question -->|Нет| combination[Сочетание]:::featured

        arrangement -->|Без повторений| awr["$$ A_n^k = \frac{n!}{(n-k)!} $$"]
        arrangement -->|С повторениями| ar["$$ \bar{A}_n^k = n^k $$"]

        combination -->|Без повторений| cwr["$$ C_n^k = \frac{n!}{(n-k)! \ k!} $$"]
        combination -->|С повторениями| cr["$$ \bar{C}_n^k = C_{n+k-1}^k $$"]

        awr -->|Используются все элементы| permutation[Перестановка]:::featured

        permutation -->|Без повторений| pwr["$$ P_n = n! $$"]
        permutation -.->|С повторениями$^*$| pr["$$ P_{n_1, \ \ldots, \ n_k} = \frac{n!}{n_1! \ \ldots \ n_k!} $$"]

Сложная инлайн $d^2$ и простая $abc$ и еще $10!$ лол $10!^2$ математика!

@mermaid
    flowchart LR
        subgraph TOP
            direction TB
            subgraph B1
                direction RL
                i1 -->f1
            end
            subgraph B2
                direction BT
                i2 -->f2
            end
        end
        A --> TOP --> B
        B1 --> B2