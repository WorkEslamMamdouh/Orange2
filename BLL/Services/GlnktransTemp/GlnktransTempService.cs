using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GlnktransTemp
{
   public class GlnktransTempService : IGlnktransTempService
    {
        private readonly IUnitOfWork unitOfWork;

        public GlnktransTempService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region VoucherTypeService Service

        public G_LnkTrans_Temp GetById(int id)
        {
            return unitOfWork.Repository<G_LnkTrans_Temp>().GetById(id);
        }

        public List<G_LnkTrans_Temp> GetAll()
        {
            return unitOfWork.Repository<G_LnkTrans_Temp>().GetAll();
        }

        public List<G_LnkTrans_Temp> GetAll(Expression<Func<G_LnkTrans_Temp, bool>> predicate)
        {
            return unitOfWork.Repository<G_LnkTrans_Temp>().Get(predicate);
        }

        public void InsertLst(List<G_LnkTrans_Temp> obj)
        {
            unitOfWork.Repository<G_LnkTrans_Temp>().Insert(obj);
            unitOfWork.Save();
            return;
        }
        public void UpdateList(List<G_LnkTrans_Temp> AccDefAccountList)
        {

            foreach (var entity in AccDefAccountList)
            {
                    unitOfWork.Repository<G_LnkTrans_Temp>().Update(entity);
             
            }
            unitOfWork.Save();

        }
        #endregion
    }
}
