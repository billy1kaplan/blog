---
title: "Lambda The Ultimate"
description: "A Review of SICP"
pubDate: "Mar 2 2019"
heroImage: '../../assets/sicp.jpg'
---

I recently finished working through the exercises in [SICP](http://sarabander.github.io/sicp/). As many before me have [written](https://www.amazon.com/review/R403HR4VL71K8), the book contains many excellent insights into core programming concepts if you're willing to put in the effort. One topic touched upon is lambda calculus. Apparently, Scheme, the wonderful language used throughout the book is based upon lambda calculus.

### Obligatory Lambda Calculus Summary

Here's a very brief summary of Lambda Calculus based on the following example:

```scheme
(λx.y z)
```

This example contains all of the different possible types of expressions which we can represent in lambda calculus.

| Expression Type | Part of Example | Description |
|----------------|----------------|-------------|
| Variable | `x` | Represents some lambda expression (like a variable in algebra) |
| Lambda Function | `λx.y` | Takes or "binds" one parameter which can be used within the body of the function |
| Function Application | `(λx.y z)` | Applies a lambda function to an argument |

We can express this more formally as a grammar:

```text
<expr> ::= <name>          <- Variable name
        |  λ<name>.<expr>  <- Lambda function
        | (<expr> <expr>)  <- Function application
```

There is only one rule for simplifying lambda expressions: substitution. During lambda function application, we can substitute all occurences of the parameter within the function body except those inside another lambda function with the same parameter name.

Perhaps this will be more clear with an example:

```scheme
((λx.(x λx.x) λx.z) y) <- apply outermost function
 ((λx.z λx.x) y)       <- replace x with argument, λx.z
           (z y)       <- no occurences of x in lambda,
                          so no substitutions occur
```

Notice in the second step that the `x` within the nested lambda function does not get substituted because an inner lambda function's parameter is bound to that `x`.

### What are the key ideas and what makes this a good basis for a programming language?

#### Lambda functions are a means of abstraction:

Let's take a closer look at applying a lambda function.

```scheme
(λ<name>.<exp> <expr>) <- applying a lambda function
```

What does it mean to apply a function? We can substitute instances of `name` with the expression we are applying to the function. With this in mind, within the body of the lambda function we can work with the *idea* of something rather than an actual *implementation*. In fact, lambda functions are more formally known as lambda abstractions.

As an example, lets look at a simple numerical example using Church encoded numbers.[^1]

```scheme
λw.λz.z
λw.λz.(w z)
λw.λz.(w (w z))
```

For me, these defintions are more readable when written as:

```scheme
λsucc.λnil.nil
λsucc.λnil.(succ nil)
λsucc.λnil.(succ (succ nil))
```

These expressions represent the exact same numbers, demonstrating that the names chosen for our variables do not change our interpretation of the expression.

Here is a function to add two of these numbers:
`λm.λn.λf.λx.(((m f) ((n f) x)))`

Using these definitions, let's rewrite a simple arithmetic expression `1 + 2 + 2` in lambda calculus:

One way to write this would be:

```scheme
(λm.λn.λf.λx.(((m f) ((n f) x))
  ((λm.λn.λf.λx.(((m f) ((n f) x))
    λsucc.λnil.(succ nil)) 
  λsucc.λnil.(succ (succ nil)))
λsucc.λnil.(succ (succ nil)))
```

Alternatively, we could write:

```scheme
(λONE.
  (λTWO.
    (λADD.
      ((ADD ONE) ((ADD TWO) TWO))
    λm.λn.λf.λx.(((m f) ((n f) x))))
  λsucc.λnil.(succ (succ nil))
λsucc.λnil.(succ nil))
```

Here, we've given clear names to our numbers and add function. This makes the intent clear and allows us to think in terms of more familiar concepts—addition and numbers—rather than a complex series of substitions. We also reuse the definitions for ADD and TWO, making future changes easier. The lambda functions themselves allow us to abstract out lower-level complexity.

Congratulations, we've just seen how to implement let-expressions! SICP introduces the idea that let-expressions are syntactic sugar for lambda expressions. In the example above, we could think of `(λONE.body λsucc.λnil.(succ nil))` as equivalent to `let ONE = λsucc.λnil.(succ nil)) in body`

This is a nice syntactic construct available in Scheme, Ocaml, Haskell, etc. while allows us to build named expressions for later usage.

#### Referential Transparency

One benefit of functional programming is "referential transparency." According to Wikipedia, referential transparency is:

> An expression is called referentially transparent if it can be replaced with its corresponding value without changing the program's behavior.

The idea of corresponding value is a bit confusing. What is the difference between an expression and value? Can we say that our Church-encoded numbers are both an expression and a value? What if our language itself contains both expressions and values?[^2]

In my view, the concept of "referential transparency" refers to expressions that can be evaluated using the substitution model of lambda calculus. Based on this definition, referentially transparent expressions cannot have mutation or the substitution based evaluation described above will break down.[^3]

The benefits of referential transparency are those that are fundamental to lambda calculus. Namely, the simplicity of the computational model, and the ability to build abstractions directly enabled by the structure of lambda calculus. Many find "elegance" in lambda calculus based programming due to the simplicity and succinctness. These are all characteristics that we as human beings find desirable.

#### Example:

Here are these ideas in the context of a simple lambda calculus interpreter I've built.

Here is an example program (note that \ is used in place of λ):

```ocaml
let TRUE = \x.\y.x in
let FALSE = \x.\y.y in
let NOT = \w.((w FALSE) TRUE) in
let SUCC = \w.\y.\x.(y ((w y) x)) in
let ZERO = \w.\z.z in
let ONE = (SUCC ZERO) in
let TWO = (SUCC ONE) in
let THREE = (SUCC TWO) in
let FOUR = (SUCC THREE) in
let ISZERO = \n.(((n FALSE) NOT) FALSE) in
let Y = \f.(\x.(f \y.((x x) y)) \x.(f \y.((x x) y))) in
let PRED = \p.\f.\x.(((p \g.\h.(h (g f))) \u.x) \x.x) in
let MULT = \a.\b.\c.(a (b c)) in
let FACT = (Y \f.\n.(((ISZERO n) 
                      (SUCC ZERO)) 
                      ((MULT n) (f (PRED n))))) in
(FACT FOUR)

// The result of the computation 
// Factorial(6) = 24
// (the church-encoded, 24th successor of 0)
\c.\x.(c (c (c (c (c (c (c (c 
      (c (c (c (c (c (c (c (c 
      (c (c (c (c (c (c (c (c x))))))))))))))))))))))))))
```

Of course, this is syntactic sugar for the much uglier:

```scheme
(\TRUE.
  (\FALSE.
    (\NOT. ...
    \w.((w FALSE) TRUE))
  \x.\y.y)
\x.\y.x)
```

which demonstrates that the sequence of let-expressions can be easily converted into a sequence of applied lambda functions.

Here is the core of the interpreter (in Ocaml):

```ocaml
let substitute var result exp =
  let rec aux exp =
    match exp with
    | Variable v' ->
      if var = v'
      then result
      else Variable v'
    | Lambda (v', body) ->
      if var <> v'
      then Lambda (v', aux body)
      else Lambda (v', body)
    | App (e1, e2) -> App (aux e1, aux e2)
  in aux exp
```

This function recursively performs lambda-calculus substitution, allowing us to evaluate the result of a function application. As an exercise, 

[Source Code](https://github.com/billy1kaplan/lambda-calculus)

---

[^1]: The idea of number encoding is by itself quite interesting—a number is a concept that can take many forms: here are some different ways of representing the same concept:
    - 2 (Arabic)
    - 0b10 (Binary)
    - 0x02 (Hexadecimal)
    - 二 (Chinese)
    - II (Roman Numeral)
    - λw.λz.(w (w z)) (Church Encoding)

[^2]: I think I'm trying to get at the idea that:
    > Code is Data. Data is Code.

    In Scheme, the source code itself can be regarded as data when we look at the usage of macros which make changes to the source code. We even do this to some extent in our text editors. Any time we do a bulk find and replace, we are treating our source code as data. Of course, we can also treat source code as code, something for our computer to interpret.

[^3]: Here's an example to show this:
    ```scheme
    λw.λz.(w (!!w (w z)))
    ```
    Imagine that `!!w` suddenly changes the meaning of w. Now, we cannot simply substitute for w as before and need to sequentially keep track of what w is during evaluation.