import logger from "../helpers/logger.helper.js";
import TicketRepository from "../repositories/ticket.repository.js";
class TicketService {

    async createTicket(ticketData){

        try {
            const existingTicket = await TicketRepository.getTicketByCode(ticketData.code);

            if(existingTicket) throw new Error("El ticket ya existe");

            return await TicketRepository.createTicket(ticketData);

        } catch (error) {
            logger.ERROR(error);
            throw new Error(error);
        }
    }
    
    async findTicketByCode(code){
        try {
            const existingTicket = await TicketRepository.getTicketByCode(code);
            if(!existingTicket){
                throw new Error("El Ticket buscado , no existe en el sistema");
            }

            return existingTicket;
        } catch (error) {
            logger.ERROR(error);
            throw error;
        }
    }

    async getTicketById(id) {
        try {
            const ticket = await TicketRepository.getTicketById(id);
            if(!ticket) throw new Error("El ticket que intenta buscar , no existe");


            return ticket;
        } catch (error) {
            logger.ERROR(error);
            return ({message: "Error al intentar encontrar el ticket", error: error});
        }
    }
}

export default new TicketService();