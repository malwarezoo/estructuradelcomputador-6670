!Este carga direcciones de memória del tp1.
		.begin
		.org 2048

L1_start		.equ 0xA00000F0	!Genera la constante con la dirección
L2_start		.equ 0xA00000F4	!Genera la constante con la dirección
mask1			.equ 2			!enmascara los 2 bits más significativos
mask2			.equ 3			!enmascara los ultimos 3 bits de L1

progl: 
	sethi 		%hi(L1), %r1 		!toma los 22 bits más significativos de la dirección L1
	add 		%r1,%lo(L1),%r1 	!sumo los bits menos significativos a r1
	ld 		%r1,%r5    		!obtengo el contenido de r1 en r5
parseo:
	srl		%r5,31,%r8		!tomo el bit más significativo lo corro 31 posiciones y lo guardo en r8
	srl		%r5,28,%r9		!toma los 4 bits significativos
	and		%r9,mask1,%r9		!enmascara los 2 bits siguientes al significativo
	and		%r5,mask2,%r10	!toma los 3 bits de la ultima posicion de r5
	and 		%r10,1,%r11		!toma el ultimo bit de r5
	srl		%r10,1,%r10		!obtiene los dos anteultimos bits de r5
recons:
	sll		%r8,31,%r8
	sll		%r9,28,%r9
	sll		%r10,1,%r10	
	or		%r8,%r9,%r12
	or		%r12,%r10,%r12
	or		%r12,%r11,%r12	
grabar:
	sethi 		%hi(L2), %r1 		
	add 		%r1,%lo(L2),%r1 	
	st 		%r12,%r1    	
	sethi 		%hi(L2), %r1 		!toma los 22 bits más significativos de la dirección L1
	add 		%r1,%lo(L2),%r1 	!sumo los bits menos significativos a r1
	ld 		%r1,%r6    		!obtengo el contenido de r1 en r5		
	jmpl 		%r15 + 4, %r0
	
.org L1_start 			!empiezo L1 en la dirección L1_start	
L1:	0xA0000003			!contenido de L1

.org L2_start           !empiezo L1 en la dirección L1_start	
L2:	0	                !contenido de L1

.end
