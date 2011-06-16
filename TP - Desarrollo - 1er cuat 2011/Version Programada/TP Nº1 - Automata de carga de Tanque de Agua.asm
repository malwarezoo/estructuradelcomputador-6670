.begin
.org 2048

	_00:
		ld [Input], %r1 					! Cargar Input en memoria (%r1)
		
		ld [A_Mask], %r3					! Evaluar si cumple con salida A
		or %r1, %r3, %r3					 
		ld [A_ID], %r4						 
		xorcc %r3, %r4, %r0					 
		bne  Eval_E_G						! No cumple con salida A.  Evaluar salida G.
		ld[S1], %r8    						! Configuro la salida S1 (Asociada a entrada A)
		add %r0, 1, %r9						! Logueo el estado al que salto.
		ba _01								! Salto al estado 1
		Eval_E_G:
			ld [G_Mask], %r3				! Evaluar si cumple con salida G
			or %r1, %r3, %r3				 
			ld [G_ID], %r4					 
			xorcc %r3, %r4, %r0				 
			bne  _00						! Ejecuto nuevamente el ciclo.
			ld[S2], %r8    					! Configuro la salida S2 (Asociada a la entrada G)
			add %r0, 2, %r9					! Logueo el estado al que salto
			ba _10							! Salto al estado 2

    _01:
		sethi %hi(0X000047D6), %r12 		!%R12 <- TiempoFuncionamientoMax = 8 Minutos.							
		add %r12, %lo(0X000047D6), %r12
		add %r0, 15,%r13
	
		_do:
		
		ld [Input], %r1 					! Cargar Input en memoria (%r1)
		
		ld [B_Mask], %r3					! Evaluar si cumple con salida B
		or %r1, %r3, %r3					! 
		ld [B_ID], %r4						! 
		xorcc %r3, %r4, %r0					! 
		bne  Timmer							! No cumple con salida B.  Evaluar salida Timmer.
		ld[S0], %r8    						! Configuro la salida S0 (Asociada a entrada B)
		add %r0, 0, %r9						! Logueo el estado al que salto.
		ba _00								! Salto al estado 0
		Timmer:
			subcc %r12, %r13, %r12			! Decremento el contador de tiempo
			bneg TimeOut
			ba _do
			TimeOut:						! La bomba funciono por mas tiempo del que debia.
				ld[S3], %r8    				! Configuro la salida S3
				add %r0, 3, %r9				! Logueo el estado al que salto
				ba _11						! Salto al estado 3
			
	_10:
		ld [Input], %r1 					! Cargar Input en memoria (%r1)
		
		ld [E_Mask], %r3					! Evaluar si cumple con salida E
		or %r1, %r3, %r3					 
		ld [E_ID], %r4					 
		xorcc %r3, %r4, %r0					 
		bne  Eval_E_F						! No cumple con salida E.  Evaluar salida F.
		ld[S0], %r8    						! Configuro la salida SO (Asociada a entrada E)
		add %r0, 0, %r9						! Logueo el estado al que salto.
		ba _00								! Salto al estado 0
		Eval_E_F:
			ld [F_Mask], %r3				! Evaluar si cumple con salida F
			or %r1, %r3, %r3				
			ld [F_ID], %r4					
			xorcc %r3, %r4, %r0				
			bne  _10						! Ejecuto nuevamente el ciclo.
			ld[S0], %r8    					! Configuro la salida S0 (Asociada a la entrada F)
			add %r0, 0, %r9					! Logueo el estado al que salto
			ba _00							! Salto al estado 0
		
	_11:
		ld [Input], %r1 					! Cargar Input en memoria (%r1)
		
		ld [C_Mask], %r3					! Evaluar si cumple con salida C
		or %r1, %r3, %r3					 
		ld [C_ID], %r4						 
		xorcc %r3, %r4, %r0					 
		bne  _11							! Ejecuto nuevamente el ciclo.
		ld[S0], %r8    						! Configuro la salida SO (Asociada a entrada C)
		add %r0, 0, %r9						! Logueo el estado al que salto.
		ba _00								! Salto al estado 0

	!Entradas

	Input: 0x00000002  !Reemplazar X por la entrada necesaria.

	!Mascara de entradas.

	A_Mask: 0x00000004
	B_Mask: 0x00000003
	C_Mask: 0x00000007
	D_Mask: 0x00000004
	E_Mask: 0x00000007
	F_Mask: 0x00000004
	G_Mask: 0x00000003

	! ID de transiciones.

	A_ID: 0x00000007
	B_ID: 0x00000007
	C_ID: 0x0000000F
	D_ID: 0x00000006
	E_ID: 0x0000000F
	F_ID: 0x00000007
	G_ID: 0x00000003

	!Salidas [La: Luz Amarilla, Lr: Luz Roja, M:Motor]

	S0:0x00000000 		! La=0, Lr=0, M=0
	S1:0x00000001		! La=0, Lr=0, M=1
	S2:0x00000002		! La=0, Lr=1, M=0
	S3:0x00000004		! La=1, Lr=0, M=0

.end
