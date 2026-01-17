/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *           description: Unikalny identyfikator użytkownika z Firebase Auth
 *         email:
 *           type: string
 *           format: email
 *           description: Adres email użytkownika
 *         firstName:
 *           type: string
 *           description: Imię użytkownika
 *         lastName:
 *           type: string
 *           description: Nazwisko użytkownika
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data utworzenia konta
 *       required:
 *         - uid
 *         - email
 *         - firstName
 *         - lastName
 * 
 *     RegisterRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *         firstName:
 *           type: string
 *           minLength: 2
 *         lastName:
 *           type: string
 *           minLength: 2
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 * 
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 * 
 *     ForgotPasswordRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *       required:
 *         - email
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: JWT token dla autoryzacji
 *         error:
 *           type: string
 * 
 *     Participant:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *       required:
 *         - userId
 *         - email
 *         - firstName
 *         - lastName
 * 
 *     Trip:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         budget:
 *           type: number
 *         ownerId:
 *           type: string
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Participant'
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - budget
 *         - ownerId
 *         - participants
 * 
 *     CreateTripData:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         budget:
 *           type: number
 *           minimum: 0
 *       required:
 *         - name
 *         - budget
 * 
 *     UpdateTripData:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         budget:
 *           type: number
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Participant'
 * 
 *     Flight:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         airline:
 *           type: string
 *         stops:
 *           type: string
 *         departureTime:
 *           type: string
 *         departureAirport:
 *           type: string
 *         arrivalTime:
 *           type: string
 *         arrivalAirport:
 *           type: string
 *         duration:
 *           type: string
 *         type:
 *           type: string
 *         price:
 *           type: number
 *         returnAirline:
 *           type: string
 *         returnStops:
 *           type: string
 *         returnDepartureTime:
 *           type: string
 *         returnDepartureAirport:
 *           type: string
 *         returnArrivalTime:
 *           type: string
 *         returnArrivalAirport:
 *           type: string
 *         returnDuration:
 *           type: string
 * 
 *     FlightSearchParams:
 *       type: object
 *       properties:
 *         from:
 *           type: string
 *           description: Kod IATA lotniska wylotu (np. WAW)
 *         to:
 *           type: string
 *           description: Kod IATA lotniska przylotu (np. LHR)
 *         date:
 *           type: string
 *           format: date
 *           description: Data wylotu (YYYY-MM-DD)
 *         returnDate:
 *           type: string
 *           format: date
 *           description: Data powrotu (YYYY-MM-DD)
 *         passengers:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       required:
 *         - from
 *         - to
 *         - date
 * 
 *     Accommodation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *             address:
 *               type: string
 *         price:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *             currency:
 *               type: string
 *             totalAmount:
 *               type: number
 *         rating:
 *           type: number
 *         reviews:
 *           type: number
 *         imageUrl:
 *           type: string
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *         link:
 *           type: string
 *         hotelClass:
 *           type: number
 * 
 *     Attraction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         rating:
 *           type: number
 *         reviews:
 *           type: number
 *         category:
 *           type: string
 *         type:
 *           type: string
 *         priceRange:
 *           type: string
 *         status:
 *           type: string
 *         openingHours:
 *           type: string
 *         description:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         website:
 *           type: string
 *         photo:
 *           type: string
 *         geometry:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 * 
 *     Restaurant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         rating:
 *           type: number
 *         reviews:
 *           type: number
 *         cuisine:
 *           type: string
 *         priceRange:
 *           type: string
 *         isOpen:
 *           type: boolean
 *         openingHours:
 *           type: string
 *         description:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         website:
 *           type: string
 *         photo:
 *           type: string
 *         geometry:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 * 
 *     PlanActivity:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [museum, restaurant, walk, attraction, transport, accommodation, other]
 *         time:
 *           type: string
 *         cost_estimate:
 *           type: number
 *         notes:
 *           type: string
 *         location:
 *           type: string
 *       required:
 *         - name
 *         - type
 *         - time
 *         - cost_estimate
 * 
 *     PlanDay:
 *       type: object
 *       properties:
 *         day:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         activities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlanActivity'
 *         daily_cost:
 *           type: number
 *       required:
 *         - day
 *         - date
 *         - activities
 * 
 *     TravelPlan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         destination:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         days:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PlanDay'
 *         total_estimated_cost:
 *           type: number
 *         tips:
 *           type: array
 *           items:
 *             type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     PlannerInput:
 *       type: object
 *       properties:
 *         origin:
 *           type: string
 *         destination:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         budget:
 *           type: number
 *         participants:
 *           type: integer
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *         transport:
 *           type: string
 *         accommodation:
 *           type: string
 *         must_visit:
 *           type: array
 *           items:
 *             type: string
 *         avoid:
 *           type: array
 *           items:
 *             type: string
 *         intensity:
 *           type: string
 *           enum: [relaxed, moderate, active]
 *       required:
 *         - destination
 *         - start_date
 *         - end_date
 *         - budget
 *         - participants
 *         - interests
 *         - transport
 *         - accommodation
 * 
 *     SplitParticipant:
 *       type: object
 *       properties:
 *         participantId:
 *           type: string
 *         amount:
 *           type: number
 *       required:
 *         - participantId
 *         - amount
 * 
 *     Expense:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tripId:
 *           type: string
 *         createdBy:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         category:
 *           type: string
 *           enum: [transport, food, accommodation, attraction, other]
 *         description:
 *           type: string
 *         amount:
 *           type: number
 *         splitWith:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SplitParticipant'
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     CreateExpenseData:
 *       type: object
 *       properties:
 *         tripId:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         amount:
 *           type: number
 *         splitWith:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SplitParticipant'
 *       required:
 *         - tripId
 *         - date
 *         - category
 *         - description
 *         - amount
 *         - splitWith
 * 
 *     Invitation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tripId:
 *           type: string
 *         tripName:
 *           type: string
 *         invitedEmail:
 *           type: string
 *           format: email
 *         invitedUserId:
 *           type: string
 *         invitedBy:
 *           type: string
 *         invitedByName:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     CreateInvitationData:
 *       type: object
 *       properties:
 *         tripId:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *       required:
 *         - tripId
 *         - email
 * 
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         error:
 *           type: string
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *         message:
 *           type: string
 */

export const schemas = {};
