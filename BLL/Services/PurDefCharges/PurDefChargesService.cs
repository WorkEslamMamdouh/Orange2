using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.PurDefCharges
{//I_Pur_D_Charges
    public class PurDefChargesService:IPurDefChargesService
    {
        private readonly IUnitOfWork unitOfWork;

        public PurDefChargesService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region IGenDefGroup Services

        public I_Pur_D_Charges GetById(int id)
        {
            return unitOfWork.Repository<I_Pur_D_Charges>().GetById(id);
        }

        public List<I_Pur_D_Charges> GetAll()
        {
            return unitOfWork.Repository<I_Pur_D_Charges>().GetAll();
        }

        public List<I_Pur_D_Charges> GetAll(Expression<Func<I_Pur_D_Charges, bool>> predicate)
        {
            return unitOfWork.Repository<I_Pur_D_Charges>().Get(predicate);
        }
        #endregion
    }
}
