.begin
.org 2048

!Inicio las variables.

add %r0, %r0, %r1     !%r1 <- 0
add %r0, %r0, %r2     !%r2 <- 0

add %r1, 4, %r1       !%r1 <- 4
add %r2, 4, %r2       !%r1 <- 4

!Condicional If

xorcc %r1, %r2, %r1   !si %r1 <> %r2 => z == 0
be true
bne false

true:
add %r0, %r0, %r3
add %r0, 1, %r3
ba endif

false:
add %r0, %r0, %r3
add %r0, 2 , %r3
ba endif

endif:

.end
