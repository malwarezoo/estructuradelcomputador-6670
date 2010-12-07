		.org 2048
		.begin

L1_start                .equ 0xA00000F0 !Genera la constante con la direcci<F3>n
mask1                   .equ 2                  !enmascara los 2 bits m<E1>s significativos
mask2                   .equ 3                  !enmascara los ultimos 3 bits de L1

			! r5 tiene el Lift Interface
			! r8 tiene el A
			! r9 tiene el F
			! r10 tiene el D
			! r11 tiene el P

progl: 
        sethi           %hi(L1), %r1            !toma los 22 bits m<E1>s significativos de la direcci<F3>n L1
        add             %r1,%lo(L1),%r1         !sumo los bits menos significativos a r1
        ld              %r1,%r5                 !obtengo el contenido de r1 en r5

			! %r5 valor de la Lift Interface (entero)
parseo:
        srl             %r5,31,%r8              !tomo el bit m<E1>s significativo lo corro 31 posiciones y lo guardo en r8
			! %r8 tiene el valor de A

        sll             %r5,1, %r9
	srl		%r9, 17, %r9
			! %r9 tiene el F

	sll		%r5, 16, %r10
	srl		%r10, 17, %r10
			! %r10 tiene el D

	and		%r5, 1, %r11
			! %r11 tiene el P

	.org L1_start
L1:	0x80040005

	.end
