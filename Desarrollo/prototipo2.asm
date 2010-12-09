		.org 2048
		.begin


		! CONSTANTES:
MAXTEMP:	3000		! cantidad de ciclos que son 3 segundos
dir_botonera	.equ 0xA00000F8	! direccion de la botonera
dir_L1		.equ 0xA00000F0	! direccion de la lift interface 1
dir_L2 		.equ 0xA00000F4	! direccion de la lift interface 2
dir_luces	.equ 0xA00000FC ! direccion de las luces


		! INIT:
		! ARC Simulator inicializa registros en cero.
					! contador1 <- 0
					! contador2 <- 0
		add	%r11, 1, %r11 	! ascensor_libre_1 <- 1
		add	%r12, 1, %r12 	! ascensor_libre_2 <- 1
		ld	[MAXTEMP],%r27

loop:
		! leemos las botoneras y los chanchos.
		call	leer_botonera

		call	actualizar_ascensores
		call	actualizar_luces
		
		! si bits_llamada == 0, ningun ascensor fue llamado
		subcc	%r16, %r0, %r0

		! actualizo los contadores antes del branch
		add	%r14, 698, %r14	! contador1 += 328 + 40 + 326 + 4 ciclos
		add	%r13, 702, %r13	! contador2 += 328 + 40 + 326 + 4 + 4 ciclos

		be	loop		! LOOP BACK

		! ascensores llamados...
		! transformo bits_llamada al piso llamado
		call	trans_bits_llamada

		! compongo lo que se escribirá en la Lift Interface seleccionada
		call	leer_lifts
		call	componer_escrituras

		! dependiendo del estado de los ascensores...

		! si ascensores libres u ocupados simulatáneamente:
		subcc	%r12, %r11, %r0

		! acumulo los contadores antes del branch
		! actualizo los contadores
		add	%r14, 696, %r14	! contador1 += 12 + 620 + 60 + 4 ciclos
		add	%r13, 700, %r13	! contador2 += 12 + 620 + 60 + 4 + 4 ciclos

		be ascensores_igual_estado

		! alguno de los dos ascensore está libre
		subcc	%r12, 1, %r0
		be	llamar_ascensor_1
		ba	llamar_ascensor_2

ascensores_igual_estado:
		addcc	%r12, 0, %r0
		bne	ambos_ascensores_libres

		! si los dos ascensores estan ocupados, ignoro la llamada
		add	%r14, 4, %r14	! contador1 += 4 ciclos
		add	%r13, 8, %r13	! contador2 += 4 + 4 ciclos
		ba	loop		! LOOP BACK

ambos_ascensores_libres:
		! si ambos estan libres se llama al mas cercano
		call	ascensor_mas_cercano
		
		! el ascensor a llamar esta en %r21
		addcc	%r21, %r0, %r0	! 0 para el ascensor1, 1 para el ascensor2

		add	%r14, 36, %r14	! contador1 += 32 + 4 ciclos
		add	%r13, 40, %r13	! contador2 += 32+ 4 + 4 ciclos
		
		be	llamar_ascensor_1
		ba	llamar_ascensor_2
		
llamar_ascensor_1:
		! escribimos a la LIFT1 para llamar
		sethi	%hi(LIFT1), %r1
		add	%r1, %lo(LIFT1), %r1
		st	%r22, %r1
		add	%r14, 300, %r14	! contador1 += 300 ciclos
		add	%r13, 304, %r13	! contador2 += 300 + 4 ciclos
		ba	loop		! LOOP BACK

llamar_ascensor_2:
		! escribimos a la LIFT2 para llamar
		sethi	%hi(LIFT2), %r1
		add	%r1, %lo(LIFT2), %r1
		st	%r23, %r1
		add 	%r14, 300, %r14	! contador1 += 300 ciclos
		add 	%r13, 304, %r13	! contador2 += 300 + 4 ciclos
		ba 	loop		! LOOP BACK



! LINEA DE RETORNO PARA TODAS LAS FUNCIONES (hipotesis: ninguna funcion anidada)
return:		jmpl	%r15 + 4, %r0



! FUNCION: leemos contadores, actualizamos ascensor_libre/ocupado (PESO (medio): 40 ciclos)
actualizar_ascensores:
		! empiezo con el ascensor 1
		addcc 	%r12, 0, %r0
		be 	ascensor_1_ocupado
		
		! si el ascensor 1 esta libre:
		and	%r0, 0, %r14		! reseteo el contador 1
		addcc	%r17, 0, %r0		! si el chancho_1 esta apagado, nada mas que hacer
		be	actualizar_ascensor_2
		and	%r0, 0, %r12		! chancho_1 prendido, apago ascensor_libre_1
		ba	actualizar_ascensor_2	! termine con el ascensor 1

ascensor_1_ocupado:
		! si el contador es mayor que MAXTEMP, libero el ascensor
		subcc 	%r14, %r27, %r0
		bneg 	actualizar_ascensor_2	! cuando contador1 < MAXTEMP
		add	%r0, 1, %r12		! prendo ascensor_libre_1
		and 	%r0, 0, %r14		! reseteo contador 1
		! ascensor 1 terminado, seguimos con el 2

actualizar_ascensor_2:
		! para el ascensor 2
		addcc 	%r11, 0, %r0
		be 	ascensor_2_ocupado
		
		! si el ascensor 2 esta libre:
		and	%r0, 0, %r13		! reseteo el contador 2
		addcc	%r18, 0, %r0		! si chancho_2 esta apagado, nada mas que hacer
		be	return
		and	%r0, 0, %r11		! chancho_2 prendido, apago ascensor_libre_2
		ba	return			! termino con ambos ascensores

ascensor_2_ocupado:
		! si el contador es mayor que MAXTEMP, libero el ascensor
		subcc 	%r13, %r27, %r0
		bneg 	return			! cuando contador2 < MAXTEMP
		add	%r0, 1, %r11		! ascensor_libre_2 <- 1
		and 	%r0, 0, %r13		! reseteo contador 2
		ba	return
! FIN FUNCION


! FUNCION: transforma el numero en bits_llamada en el piso equivalente (PESO: 12 ciclos)
trans_bits_llamada:
		! primero considero el caso en que es 8 (4to bit seteado)
		andcc	%r16, 8, %r0
		bne	es_ocho
		! si no es ocho, basta con hacer un shift a la izquierda
		srl	%r16, 1, %r16
		ba	return
es_ocho:
		add	%r0, 3, %r16
		ba	return
! FIN FUNCION


! FUNCION: parsea los valores de la botonera y los chanchos. (PESO: 328 ciclos)
leer_botonera:
		sethi 	%hi(BOTONERA), %r1 		!toma los 22 bits m�s significativos de la direcci�n L1
		add 	%r1,%lo(BOTONERA),%r1 	!sumo los bits menos significativos a r1
		ld 	%r1,%r5    		!obtengo el contenido de r1 en r5
		srl	%r5,5,%r18		!toma el valor de chancho 2
		srl	%r5,4,%r1		!obtiene bits 4 y 5
		sll	%r1,31,%r1		!elimina lo izq a 4
		srl	%r1,31,%r17		!obtiene bit , el chancho 1
		sll	%r5,28,%r16		!elimina lo izq a 0..3
		srl	%r16,28,%r16		!obtiene bits 0..3
		ba 	return
! FIN FUNCION


! FUNCION: compone el A, F y D de cada Lift Interface para escribir (S es cero) (PESO: 60 ciclos)
componer_escrituras:
		! PARA LA LIFT1 
		add 	%r0, 1, %r1
		sll	%r1, 31, %r1		! en r1 esta la parte de A, de la LIFT1
		sll	%r16, 16, %r2		! en r2 esta la parte de F, de la LIFT1
		sll	%r24, 1, %r3		! en r3 esta la parte de D, de la LIFT1
		! compongo a_escribir_1 con or sucesivo
		or	%r1, %r2, %r1
		or	%r1, %r3, %r1
		or	%r1, 1, %r22		! en r22, a_escribir, listo para ir a LIFT1

		! PARA LA LIFT2
		add 	%r0, 1, %r1
		sll	%r1, 31, %r1		! en r1 esta la parte de A, de la LIFT1
		sll	%r16, 16, %r2		! en r2 esta la parte de F, de la LIFT1
		sll	%r25, 0, %r3		! en r3 esta la parte de D, de la LIFT1
		! compongo a_escribir_2 con or sucesivo
		or	%r1, %r2, %r1
		or	%r1, %r3, %r1
		or	%r1, 0, %r23		! en r23, a_escribir, listo para ir a LIFT1
		ba 	return
! FIN FUNCION


! FUNCION: lee los valores D de las Lift Interface a los registros r24 y r25 (PESO: 620 ciclos)
leer_lifts: 
		sethi	%hi(LIFT1), %r1
		add	%r1,%lo(LIFT1),%r1
		ld	%r1,%r5			!obtengo el contenido de la LIFT1 en r5	
		sethi	%hi(LIFT2), %r1
		add	%r1,%lo(LIFT2),%r1
		ld	%r1,%r6			!obtengo el contenido de la LIFT2 en r6
		! parseo los valores de interes
		sll	%r5, 16, %r24
		srl	%r24, 17, %r24		! %r24 tiene el D del LIFT1
		sll	%r6, 16, %r25
		srl	%r25, 17, %r25		! %r25 tiene el D del LIFT2
		ba	return
! FIN FUNCION


! FUNCION: si ambos ascensores estan libres, decide cual llamar (PESO (medio): 32 ciclos)
ascensor_mas_cercano:
		! ENTRADA: %r24 tiene el piso en que se encuentra (libre) el ascensor 1
		! ENTRADA: %r25 tiene el piso en que se encuentra (libre) el ascensor 2
		! ENTRADA: %r16 tiene el piso en que se produzco la llamada.
		! SALIDA:  %r21 tiene el ascensor al cual llamar: 0 para el asc1 y 1 para el asc2

		! obtengo la distancia absoluta entre el ascensor 1 y el piso de llamada
		subcc	%r24, %r16, %r1		! %r1 tiene la distancia con signo del ascensor 1
		bneg	dist_abs_1
sigo_1:		subcc	%r25, %r16, %r2		! %r2 tiene la distancia con signo del ascensor 2		
		bneg	dist_abs_2
sigo_2:		subcc	%r2, %r1, %r0		! %r2 - %r1 < 0  =>  r1 esta mas lejos.
		bneg	seteo_ascensor_2
		add	%r0, %r0, %r21		! seteo para llamar al ascensor 1
		ba	return
seteo_ascensor_2:
		add	%r0, 1, %r21		! seteo para llamar al ascensor 2
		ba	return

dist_abs_1:	! si %r1 tiene un numero negativo le resto dos veces si mismo
		sll	%r1, 1, %r3		! %r3 <- %r2 * 2
		sub	%r1, %r3, %r1		! %r1 <- %r1 - %r3
		ba	sigo_1
dist_abs_2:	! si %r2 tiene un numero negativo le resto dos veces si mismo
		sll	%r2, 1, %r3		! %r3 <- %r2 * 2
		sub	%r2, %r3, %r2		! %r2 <- %r2 - %r3
		ba	sigo_2
! FIN FUNCION


! FUNCION: las luces estan apagadas a menos que se llame a un ascensor (PESO (medio): 326 ciclos)
actualizar_luces:
		and	%r0, %r0, %r20		! comienzo en cero
		andcc	%r12, %r11, %r0
		bn	escribir_luces		! branch si ambos ascensores estan libres
		or	%r0, 4, %r20		! algun ascensor en uso, prendo el pulsador

		orcc	%r12, 0, %r0
		bn	prender_asc1		! branch si el ascensor 1 esta libre
sigo_luces:	orcc	%r11, 0, %r0
		or	%r20, 2, %r20		! prendo la luz del ascensor 2
		ba	escribir_luces
prender_asc1:	or	%r21, 1, %r20		! prendo la luz del ascensor 1
		ba	sigo_luces		! sigo con el ascensor 2

escribir_luces:	! %r20 tiene lo que hay que escribir en dir_luces
		sethi	%hi(LUCES), %r1
		add	%r1, %lo(LUCES), %r1
		st	%r20, %r1
		ba	return
! FIN FUNCION

		! para facilitar el acceso (dummy values!)
		.org dir_botonera
BOTONERA:	0x00000002	! ambos ascensores libres, y llamado desde PB
		.org dir_L1
LIFT1:		6		! el ascensor 1 esta en 2do piso
		.org dir_L2
LIFT2:		2		! el ascensor 2 esta en PB
		.org dir_luces
LUCES:		0		! ambos ascensores libres, luces apagadas


		.end
