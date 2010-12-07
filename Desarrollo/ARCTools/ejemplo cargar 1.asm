!Este carga direcciones de la memoria 0xA00000F8.
		.begin
		.org 2048


store:
	sethi	%hi(DUMMY), %r1
	add 	%r1, %lo(DUMMY), %r1
	add 	%r0, 1, %r2
	st	%r2, %r1


load: 
	sethi 		%hi(DUMMY), %r1 		!toma los 22 bits m�s significativos de la direcci�n L1
	add 		%r1,%lo(DUMMY),%r1 	!sumo los bits menos significativos a r1
	ld 		%r1,%r5    		!obtengo el contenido de r1 en r5
parseo:
	srl		%r5,5,%r18		!toma el valor de chancho 2
	srl		%r5,4,%r1		!obtiene bits 4 y 5
	sll		%r1,31,%r1		!elimina lo izq a 4
	srl		%r1,31,%r17		!obtiene bit , el chancho 1
	sll		%r5,28,%r16		!elimina lo izq a 0..3
	srl		%r16,28,%r16		!obtiene bits 0..3
	jmpl 		%r15 + 4, %r0
	
L1   		.equ 0xA00000F8	!constante con la direcci�n	
	.org L1
DUMMY:	31337

		.end
