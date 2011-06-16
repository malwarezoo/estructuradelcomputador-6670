.begin
.org 2048

InPut_Dir   .equ 0x05000000
OutPut_Dir  .equ 0x06000000

	_00:
        sethi %hi(InPut), %r1          ! Cargar Input en memoria (%r1)
        add %r1, %lo(InPut), %r1
		
		ld [A_Mask], %r3				! Evaluar si cumple con Transicion A
		or %r1, %r3, %r3					 
		ld [A_ID], %r4						 
		xorcc %r3, %r4, %r0					 
		bne  Eval_E_G				    ! No cumple con Transicion A.  Evaluar transicion G.
		ld[S1], %r7    				    ! Configuro la salida S1 (Asociada a transicion A)
        sethi %hi(OutPut_Dir), %r8
        add %r8, %lo(OutPut_Dir), %r8
        st %r7, %r8
        ba _01					        ! Salto al estado 1
		Eval_E_G:
			ld [G_Mask], %r3			! Evaluar si cumple con transicion G
			or %r1, %r3, %r3				 
			ld [G_ID], %r4					 
			xorcc %r3, %r4, %r0				 
			bne  _00				    ! Ejecuto nuevamente el ciclo.
			ld[S2], %r7    			    ! Configuro la transicion S2 (Asociada a la transicion G)
            sethi %hi(OutPut_Dir), %r8
            add %r8, %lo(OutPut_Dir), %r8
            st %r7, %r8
			ba _10				        ! Salto al estado 2

    _01:
		sethi %hi(0X000047D6), %r12 	!%R12 <- TiempoFuncionamientoMax = 8 Minutos.		
		add %r12, %lo(0X000047D6), %r12
		add %r0, 15,%r13
	
		_do:
		
        sethi %hi (InPut), %r1          ! Cargar Input en memoria (%r1)
        add %r1, %lo(InPut), %r1
		
		ld [B_Mask], %r3				! Evaluar si cumple con transicion B
		or %r1, %r3, %r3				 
		ld [B_ID], %r4				 
		xorcc %r3, %r4, %r0			 
		bne  Timmer				        ! No cumple con transicion B.  Evaluar transicion Timmer.
		ld[S0], %r7    				    ! Configuro la salida S0 (Asociada a entrada B)
        sethi %hi(OutPut_Dir), %r8
        add %r8, %lo(OutPut_Dir), %r8
        st %r7, %r8

		ba _00					        ! Salto al estado 0
		Timmer:
			subcc %r12, %r13, %r12		! Decremento el contador de tiempo
			bneg TimeOut
			ba _do
			TimeOut:				    ! La bomba funciono por mas tiempo del que debia.
				ld[S3], %r7    		    ! Configuro la salida S3
                sethi %hi(OutPut_Dir), %r8
                add %r8, %lo(OutPut_Dir), %r8
                st %r7, %r8

				ba _11			        ! Salto al estado 3
			
	_10:
        sethi %hi (InPut), %r1          ! Cargar Input en memoria (%r1)
        add %r1, %lo(InPut), %r1
		
		ld [E_Mask], %r3				! Evaluar si cumple con transicion E
		or %r1, %r3, %r3					 
		ld [E_ID], %r4					 
		xorcc %r3, %r4, %r0					 
		bne  Eval_E_F				    ! No cumple con transicion E.  Evaluar transicion F.
		ld[S0], %r7    				    ! Configuro la salida S0 (Asociada a transicion E)
        sethi %hi(OutPut_Dir), %r8
        add %r8, %lo(OutPut_Dir), %r8
        st %r7, %r8

		ba _00					        ! Salto al estado 0
		Eval_E_F:
			ld [F_Mask], %r3			! Evaluar si cumple con transicion F
			or %r1, %r3, %r3				
			ld [F_ID], %r4					
			xorcc %r3, %r4, %r0				
			bne  _10				    ! Ejecuto nuevamente el ciclo.
			ld[S0], %r7    			    ! Configuro la salida S0 (Asociada a la transicion F)
            sethi %hi(OutPut_Dir), %r8
            add %r8, %lo(OutPut_Dir), %r8
            st %r7, %r8

			ba _00				        ! Salto al estado 0
		
	_11:
        sethi %hi (InPut), %r1          ! Cargar Input en memoria (%r1)
        add %r1, %lo(InPut), %r1
		
		ld [C_Mask], %r3				! Evaluar si cumple con transicion C
		or %r1, %r3, %r3					 
		ld [C_ID], %r4						 
		xorcc %r3, %r4, %r0					 
		bne  _11					    ! Ejecuto nuevamente el ciclo.
		ld[S0], %r7    				    ! Configuro la salida SO (Asociada a transicion C)
        sethi %hi(OutPut_Dir), %r8
        add %r8, %lo(OutPut_Dir), %r8
        st %r7, %r8
        
		ba _00					        ! Salto al estado 0

	!Entradas

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
    
    .org InPut_Dir
    InPut:0x00000007   ! Suplantar los ultimos 4 bits por la entrada deseada..

.end
