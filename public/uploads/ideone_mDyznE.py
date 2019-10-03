# your code goes here
x = ['kasol', 'kasol', 'manali', 'delhi', 'delhi', 'manali' , 'kasol' ]

y = ['1', 'a', 'c', 'b', 'c' , '1']
a = set()
b = set()

for i in x:
    a.add(i)

for i in y:
    b.add(i)

print(x)
for i in a:
    print(i, x.count(i))

print(y)
for i in b:
    print(i , y.count(i) )