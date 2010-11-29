!Este carga direcciones de la memoria 0xA00000F8.
		.begin
		.org 2048

dir_start		.equ 0xA00000F8	!constante con la dirección

maskBoton		.equ 2			!enmascara los bits que corresponden al boton seleccionado
mask1			.equ 1

load: 
	sethi 		%hi(L1), %r1 		!toma los 22 bits más significativos de la dirección L1
	add 		%r1,%lo(L1),%r1 	!sumo los bits menos significativos a r1
	ld 		%r1,%r5    		!obtengo el contenido de r1 en r5
parseo:
	srl		%r5,5,%r18		!toma el valor de chancho 2
	srl		%r5,4,%r1		!obtiene bits 4 y 5
	sll		%r1,31,%r1		!elimina lo izq a 4
	srl		%r1,31,%r17		!obtiene bit , el chancho 1
	sll		%r5,28,%r16		!elimina lo izq a 0..3
	srl		%r16,28,%r16		!obtiene bits 0..3
	jmpl 		%r15 + 4, %r0
	
	
	.org dir_start 		!empiezo L1 en la dirección L1_start	
L1:	0x00000024			!contenido de L1


		.end
